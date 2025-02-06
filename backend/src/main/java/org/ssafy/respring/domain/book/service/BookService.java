package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.BookLikesRepository;
import org.ssafy.respring.domain.book.repository.BookRepository;
import org.ssafy.respring.domain.book.repository.BookViewsRepository;

import org.ssafy.respring.domain.book.repository.ChapterRepository;
import org.ssafy.respring.domain.book.vo.Book;

import org.ssafy.respring.domain.book.vo.BookLikes;
import org.ssafy.respring.domain.book.vo.BookViews;
import org.ssafy.respring.domain.book.vo.Chapter;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

	private final BookRepository bookRepository;
	private final BookLikesRepository bookLikesRepository;
	private final BookViewsRepository bookViewsRepository;
	private final UserRepository userRepository;
	private final StoryRepository storyRepository;
	private final ChapterRepository chapterRepository;
	private final BookViewsRedisService bookViewsRedisService;
	private final BookLikesRedisService bookLikesRedisService;
	private final RedisTemplate<String, Object> redisTemplate;
	private final ElasticsearchClient esClient;

	private static final String RECENT_VIEW_KEY = "user:recent:books:";

	@Transactional
	public Long createBook(BookRequestDto requestDto, UUID userId) {
		User user = getUSerById(userId);

		Book book = Book.builder()
				.author(user)
				.title(requestDto.getTitle())
				.coverImage(requestDto.getCoverImage())
				.tags(requestDto.getTags())
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build();

		bookRepository.save(book);

		// 챕터 저장
		List<Chapter> chapters = requestDto.getChapters().stream()
				.map(chapterDto -> Chapter.builder()
						.book(book)
						.chapterTitle(chapterDto.getChapterTitle())
						.chapterContent(chapterDto.getChapterContent())
						.build())
				.collect(Collectors.toList());

		chapterRepository.saveAll(chapters);
		return book.getId();
	}

	@Transactional
	public void updateBook(Book book) {
		book.setUpdatedAt(LocalDateTime.now());
		bookRepository.save(book);
	}

	@Transactional
	public void deleteBook(Long bookId) {
		bookRepository.deleteById(bookId);
	}

	@Transactional
	public BookResponseDto getBookDetail(Long bookId, UUID userId) {
		Book book = getBookById(bookId);
		viewBook(book, userId);

		boolean isLiked = isBookLiked(bookId, userId);
		Long likeCount = bookLikesRedisService.getLikeCount(bookId);
		Long viewCount = bookViewsRedisService.getViewCount(bookId);
		List<String> imageUrls = getImagesFromStories(book.getStoryIds());
		String bookContent = getBookContent(bookId);

		return BookResponseDto.toResponseDto(
				book,
				isLiked, // ✅ 좋아요 여부 포함
				likeCount,
				viewCount,
				imageUrls,
				true,
				bookContent
		);
	}



	private String getBookContent(Long bookId) {
		List<Chapter> chapters = chapterRepository.findByBookIdOrderByTrend(bookId);
		List<Map<String, String>> chapterContents = new ArrayList<>();

		for (Chapter chapter : chapters) {
			Map<String, String> chapterMap = new LinkedHashMap<>();
			chapterMap.put("chapterTitle", chapter.getChapterTitle());
			chapterMap.put("chapterContent", chapter.getChapterContent());
			chapterContents.add(chapterMap);
		}

		try {
			ObjectMapper objectMapper = new ObjectMapper();
			return objectMapper.writeValueAsString(chapterContents);
		} catch (JsonProcessingException e) {
			throw new RuntimeException("Error converting chapters to JSON", e);
		}
	}

	@Transactional
	public void viewBook(Book book, UUID userId) {
		Long bookId = book.getId();
		User user = getUSerById(userId);

		bookViewsRedisService.incrementViewCount(bookId);
		if (!bookViewsRepository.existsByBookIdAndUserId(bookId, userId)) {
			bookViewsRepository.save(new BookViews(null, book, user));
		}
		saveRecentView(user.getId(), bookId);
	}

	public Long getBookViewCount(Long bookId) {
		return bookViewsRedisService.getViewCount(bookId);
	}

	@Transactional
	public List<BookResponseDto> getBooksByAuthorId(UUID authorId, UUID userId) {
		return bookRepository.findByAuthorId(authorId).stream()
				.map(book -> BookResponseDto.toResponseDto(
						book,
						isBookLiked(book.getId(), userId), // ✅ 좋아요 여부 확인
						bookLikesRedisService.getLikeCount(book.getId()),
						bookViewsRedisService.getViewCount(book.getId()),
						getImagesFromStories(book.getStoryIds()),
						false,
						null
				))
				.collect(Collectors.toList());
	}

	@Transactional
	public List<BookResponseDto> getAllBooksSortedByTrends(UUID userId) {
		return bookRepository.getAllBooksSortedByTrends().stream()
				.map(book -> BookResponseDto.toResponseDto(
						book,
						isBookLiked(book.getId(), userId), // ✅ 좋아요 여부 확인
						bookLikesRedisService.getLikeCount(book.getId()),
						bookViewsRedisService.getViewCount(book.getId()),
						getImagesFromStories(book.getStoryIds()),
						false,
						null
				))
				.collect(Collectors.toList());
	}

	@Transactional
	public List<BookResponseDto> getWeeklyTop3Books(UUID userId) {
		return bookRepository.getWeeklyTop3Books().stream()
				.map(book -> BookResponseDto.toResponseDto(
						book,
						isBookLiked(book.getId(), userId), // ✅ 좋아요 여부 확인
						bookLikesRedisService.getLikeCount(book.getId()),
						bookViewsRedisService.getViewCount(book.getId()),
						getImagesFromStories(book.getStoryIds()),
						false,
						null
				))
				.collect(Collectors.toList());
	}

	@Transactional
	public boolean toggleLikeBook(Long bookId, User user) {
		Book book = getBookById(bookId);
		boolean isLiked = book.toggleLike(user.getId());

		if (isLiked) {
			bookLikesRedisService.addLike(bookId, user.getId());
			bookLikesRepository.save(new BookLikes(null, book, user, LocalDateTime.now()));
		} else {
			bookLikesRedisService.removeLike(bookId, user.getId());
			bookLikesRepository.deleteByBookIdAndUserId(bookId, user.getId());
		}

		bookRepository.save(book);
		return isLiked;
	}

	public boolean isBookLiked(Long bookId, UUID userId) {
		return bookLikesRedisService.isLiked(bookId, userId);
	}

	private void saveRecentView(UUID userId, Long bookId) {
		String key = RECENT_VIEW_KEY + userId;
		redisTemplate.opsForList().remove(key, 0, bookId.toString());
		redisTemplate.opsForList().leftPush(key, bookId.toString());
		redisTemplate.opsForList().trim(key, 0, 4);
		redisTemplate.expire(key, 30, TimeUnit.DAYS);
	}

	public List<Book> getRecentViewedBooks(UUID userId) {
		String key = RECENT_VIEW_KEY + userId;
		List<String> bookIdStrings = Optional.ofNullable(redisTemplate.opsForList().range(key, 0, 4))
				.orElse(List.of()).stream()
				.map(Object::toString)
				.collect(Collectors.toList());

		List<Long> bookIds = bookIdStrings.stream()
				.map(id -> {
					try {
						return Long.parseLong(id);
					} catch (NumberFormatException e) {
						return null;
					}
				})
				.filter(Objects::nonNull)
				.collect(Collectors.toList());

		return bookIds.stream()
				.map(bookRepository::findById)
				.flatMap(Optional::stream)
				.collect(Collectors.toList());
	}

	private Book getBookById(Long bookId) {
		return bookRepository.findById(bookId)
				.orElseThrow(() -> new IllegalArgumentException("❌ 해당하는 봄날의 서가 없습니다!"));
	}

	private User getUSerById(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(()-> new IllegalArgumentException("❌ 존재하지 않는 사용자입니다."));
	}

	private List<String> getImagesFromStories(Set<Long> storyIds) {
		return storyRepository.findAllById(storyIds).stream()
				.flatMap(story -> story.getImages() != null ? story.getImages().stream() : List.<Image>of().stream())
				.map(Image::getImageUrl)
				.collect(Collectors.toList());
	}


	private void validateOwner(UUID correctId, UUID userId) {
		if (!correctId.equals(userId)) {
			throw new IllegalArgumentException("❌ 접근 권한이 없습니다!");
		}
	}

	// 자신의 story인지 확인하는 과정 (프론트에서 잘못된 값이 들어올 경우)
	private void validateUserStories(Set<Long> storyIds, UUID userId) {
		List<Long> invalidStories = storyRepository.findAllById(storyIds).stream()
				.filter(story -> !story.getUser().getId().equals(userId))
				.map(story -> story.getId())
				.collect(Collectors.toList());

		if (!invalidStories.isEmpty()) {
			throw new IllegalArgumentException("❌ 잘못된 글조각입니다. 다시 선택해주세요!");
		}
	}
}
