package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.BookInfoRepository;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;
import org.ssafy.respring.domain.book.util.BookMapper;
import org.ssafy.respring.domain.book.vo.Book;

import org.ssafy.respring.domain.book.vo.BookInfo;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
	private final MongoBookRepository bookRepository;
	private final StoryRepository storyRepository;
	private final BookInfoRepository bookInfoRepository;
	private final ImageService imageService;
	// private final UserRepository userRepository;
	private final BookMapper bookMapper;
	private final ElasticsearchClient esClient;
	private final RedisTemplate<String, String> redisTemplate;

	@Value("${file.upload-dir}")
	private String uploadDir;

	private static final String RECENT_VIEW_KEY = "user:recent:books:";

	public String createBook(BookRequestDto requestDto, MultipartFile coverImg) {
//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

		Book book = new Book();
		book.setTitle(requestDto.getTitle());
		book.setTags(requestDto.getTags());
		book.setCoverImage(imageService.saveCoverImage(coverImg));
		book.setContent(requestDto.getContent());
		book.setLikeCount(0L);
		book.setViewCount(0L);
		book.setCreatedAt(LocalDateTime.now());
		book.setUpdatedAt(LocalDateTime.now());
		book.setStoryIds(requestDto.getStoryIds());

		bookRepository.save(book);

		User user = new User();
		user.setId(requestDto.getUserId());
		user.setUserNickname(requestDto.getAuthorName());

		BookInfo bookInfo = new BookInfo();
		bookInfo.setBookId(book.getId());
		bookInfo.setAuthor(user);
		bookInfoRepository.save(bookInfo);

		// Elasticsearch에 인덱싱
		indexBookInES(book, "create");

		return book.getId();
	}

	public void updateBook(UUID userId, String bookId, BookUpdateRequestDto requestDto, MultipartFile coverImg) {
		Book book = getBookById(bookId, userId, true);

		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());
		book.setTags(requestDto.getTags());
		book.setCoverImage(imageService.saveCoverImage(coverImg));

		validateUserStories(requestDto.getStoryIds(), userId);
		book.setStoryIds(requestDto.getStoryIds());

		book.setCreatedAt(LocalDateTime.now());
		book.setUpdatedAt(LocalDateTime.now());

		bookRepository.save(book);

		// Elasticsearch에도 데이터 업데이트
		indexBookInES(book, "update");
	}

	// 자신의 story인지 확인하는 과정
	private void validateUserStories(Set<Long> storyIds, UUID userId) {
		boolean isValid = storyIds.stream()
				.allMatch(storyId -> storyRepository.findById(storyId)
						.map(story -> story.getUser().getId().equals(userId))
						.orElse(false));

		if (!isValid) {
			throw new IllegalArgumentException("One or more stories do not belong to the user.");
		}
	}

	private Book getBookById(String bookId, UUID userId, boolean checkValidUser) {
		Book book = bookRepository.findById(bookId)
				.orElseThrow(() -> new IllegalArgumentException("Book not found - id: " + bookId));
		if (checkValidUser) {
			validateOwner(book.getUserId(), userId);
		}
		return book;
	}

	private BookInfo getBookInfoByBookId(String bookId, UUID userId, boolean checkAuthor) {
		BookInfo bookInfo = bookInfoRepository.findByBookId(bookId)
				.orElseThrow(() -> new IllegalArgumentException("Book info not found"));
		if (checkAuthor) {
			validateOwner(bookInfo.getAuthor().getId(), userId);
		}
		return bookInfo;
	}

	private void validateOwner(UUID correctId, UUID userId) {
		if (!correctId.equals(userId)) {
			throw new IllegalArgumentException("❌ 접근 권한이 없습니다!");
		}
	}

	public List<BookResponseDto> getAllBooks() {
		Sort sort = Sort.by(Sort.Order.desc("likeCount")); // 좋아요 내림차순 정렬

		return bookRepository.findAll(sort)
				.stream()
				.map(book -> {
					BookInfo bookInfo = bookInfoRepository.findByBookId(book.getId())
							.orElseThrow(() -> new IllegalArgumentException("Book info not found"));
					return getBookResponse(book.getUserId(), book, bookInfo);
				})
				.collect(Collectors.toList());
	}

	public List<BookResponseDto> getBooksByUser(UUID userId) {
		return bookRepository.findByUserId(userId)
				.stream()
				.map(book -> {
					BookInfo bookInfo = bookInfoRepository.findByBookId(book.getId())
							.orElseThrow(() -> new IllegalArgumentException("Book info not found"));
					return getBookResponse(userId, book, bookInfo);
				})
				.collect(Collectors.toList());
	}

	// 책 상세 조회 (조회수 증가)
	@Transactional
	public BookResponseDto getBookDetail(UUID userId, String bookId) {
		Book book = getBookById(bookId, userId, false);

		BookInfo bookInfo = bookInfoRepository.findByBookId(bookId)
				.orElseThrow(() -> new IllegalArgumentException("Book info not found"));

		// 조회수 증가 (MongoDB)
		book.increaseViewCount();
		bookRepository.save(book);

		// 조회 기록 업데이트 (MySQL)
		bookInfo.getViewedUsers().add(userId);
		bookInfoRepository.save(bookInfo);

		// 최근 조회 기록 저장 (Redis)
		saveRecentView(userId, bookId);

		return getBookResponse(userId, book, bookInfo);
	}

	// 최근 본 책 저장 (Redis)
	private void saveRecentView(UUID userId, String bookId) {
		String key = RECENT_VIEW_KEY + userId;
		redisTemplate.opsForList().remove(key, 0, bookId);
		redisTemplate.opsForList().leftPush(key, bookId);
		redisTemplate.opsForList().trim(key, 0, 4);
		redisTemplate.expire(key, 30, TimeUnit.DAYS);
	}

	// ✅ 특정 사용자의 최근 조회한 책 목록 조회
	public List<BookResponseDto> getRecentViewedBooks(UUID userId) {
		String key = RECENT_VIEW_KEY + userId;
		List<String> bookIds = Optional.ofNullable(redisTemplate.opsForList().range(key, 0, 4))
				.orElse(List.of());

		return bookIds.stream()
				.map(bookId -> {
					Book book = getBookById(bookId, userId, true);

					BookInfo bookInfo = bookInfoRepository.findByBookId(bookId)
							.orElseThrow(() -> new IllegalArgumentException("Book info not found"));

					return getBookResponse(userId, book, bookInfo);
				})
				.collect(Collectors.toList());
	}

	// 좋아요 추가/삭제
	@Transactional
	public boolean toggleLike(String bookId, UUID userId) {

		BookInfo bookInfo = bookInfoRepository.findByBookId(bookId)
				.orElseThrow(() -> new IllegalArgumentException("Book info not found"));

		boolean isLiked = bookInfo.toggleLike(userId);
		bookInfoRepository.save(bookInfo);

		// 좋아요 수 업데이트 (MongoDB)
		Book book = bookRepository.findById(bookId).orElseThrow();
		book.updateLikeCount((long) Optional.ofNullable(bookInfo.getLikedUsers()).orElse(new HashSet<>()).size());
		bookRepository.save(book);

		return isLiked;
	}

	public void deleteBook(String bookId, UUID userId) {
		BookInfo bookInfo = bookInfoRepository.findByBookId(bookId)
				.orElseThrow(() -> new IllegalArgumentException("Book info not found"));

		if (!bookInfo.getAuthor().getId().equals(userId)) {
			throw new IllegalArgumentException("You are not allowed to delete this book");
		}

		bookRepository.deleteById(bookId);
		bookInfoRepository.delete(bookInfo);

		// Elasticsearch에서도 삭제
		deleteBookInES(bookId);
	}

	public List<BookResponseDto> getWeeklyTop3() {
		LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

		Pageable pageable = PageRequest.of(0, 3, Sort.by(
				Sort.Order.desc("likeCount"),  // 1순위: 좋아요 많은 순
				Sort.Order.desc("viewCount"),   // 2순위: 조회수 많은 순
				Sort.Order.desc("createdAt") // 3순위: 최신순 (동일한 경우)
		));

		return bookRepository.findTop3ByCreatedAtAfter(oneWeekAgo, pageable)
				.stream()
				.map(book -> {
					BookInfo bookInfo = bookInfoRepository.findByBookId(book.getId())
							.orElseThrow(() -> new IllegalArgumentException("Book info not found"));

					return getBookResponse(book.getUserId(), book, bookInfo);
				})
				.collect(Collectors.toList());
	}


	// Elasticsearch에 인덱싱
	private void indexBookInES(Book book, String method) {
		try {
			esClient.index(i -> i.index("books").id(book.getId()).document(book));
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch " + method + " 실패", e);
		}
	}

	// Elasticsearch에서 삭제
	private void deleteBookInES(String bookId) {
		try {
			esClient.delete(d -> d.index("books").id(bookId));
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 삭제 실패", e);
		}
	}

	public  List<BookResponseDto> getBooksSorted(List<String> sortFields, List<String> directions) {
		Sort sort = buildSort(sortFields, directions);
		return bookRepository.findAll(sort).stream()
				.map(book -> {
					BookInfo bookInfo = bookInfoRepository.findByBookId(book.getId())
							.orElseThrow(() -> new IllegalArgumentException("Book info not found"));

					return getBookResponse(book.getUserId(), book, bookInfo);
				})
				.collect(Collectors.toList());
	}

	private Sort buildSort(List<String> sortFields, List<String> directions) {
		if (sortFields == null || sortFields.isEmpty()) {
			return Sort.unsorted();
		}

		Sort sort = Sort.unsorted();
		for (int i = 0; i < sortFields.size(); i++) {
			String field = sortFields.get(i);
			Sort.Direction direction = (i < directions.size() && "desc".equalsIgnoreCase(directions.get(i)))
					? Sort.Direction.DESC
					: Sort.Direction.ASC;
			sort = sort.and(Sort.by(direction, field));
		}

		return sort;
	}

	public BookResponseDto getBookResponse(UUID userId, Book book, BookInfo bookInfo) {
		List<String> storyImageUrls = getImagesFromStories(book.getStoryIds());
		return bookMapper.toResponseDto(userId, book, bookInfo, storyImageUrls);
	}

	private List<String> getImagesFromStories(Set<Long> storyIds) {
		return storyRepository.findAllById(storyIds).stream()
				.flatMap(story -> story.getImages() != null ? story.getImages().stream() : List.<Image>of().stream())
				.map(Image::getImageUrl)
				.collect(Collectors.toList());
	}
}
