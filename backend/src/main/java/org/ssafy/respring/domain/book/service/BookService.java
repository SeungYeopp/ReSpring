package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.mail.Multipart;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookDetailResponseDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.info.BookLikesRepository;
import org.ssafy.respring.domain.book.repository.BookRepository;
import org.ssafy.respring.domain.book.repository.info.BookViewsRepository;

import org.ssafy.respring.domain.book.repository.MongoBookContentRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.BookContent;
import org.ssafy.respring.domain.book.vo.BookLikes;
import org.ssafy.respring.domain.book.vo.BookViews;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.service.CommentService;
import org.ssafy.respring.domain.image.service.ImageService;
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
	@Lazy
	private final MongoBookContentRepository bookContentRepository;
	private final ObjectMapper objectMapper;

	private final CommentService commentService;
	private final ImageService imageService;
	private final BookViewsRedisService bookViewsRedisService;
	private final BookLikesRedisService bookLikesRedisService;
	private final RedisTemplate<String, Object> redisTemplate;
	private final ElasticsearchClient esClient;

	private static final String RECENT_VIEW_KEY = "user:recent:books:";

	@Transactional
	public Long createBook(BookRequestDto requestDto, MultipartFile coverImage) {
		User user = getUSerById(requestDto.getUserId());

		String coverImageUrl = imageService.saveCoverImage(coverImage);

		Book book = Book.builder()
				.author(user)
				.title(requestDto.getTitle())
				.coverImage(coverImageUrl)
				.tags(requestDto.getTags())
		  		.content(convertContentToJson(requestDto.getContent()))
		  		.storyIds(requestDto.getStoryIds())
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build();

		bookRepository.save(book);

		BookContent bookContent = new BookContent();
		bookContent.setBookId(book.getId());
		bookContent.setContent(requestDto.getContent());
		bookContentRepository.save(bookContent);

		// ✅ Elasticsearch 색인 수행
		indexBookData(book, "book_title");

		return book.getId();
	}

	@Transactional
	public void updateBook(BookUpdateRequestDto requestDto, MultipartFile coverImage) {

		boolean isUpdated = false; // 변경 여부 추적

		// 1️⃣ 기존 책 조회 및 권한 검증
		Book book = getBookById(requestDto.getBookId(), requestDto.getUserId());

		String coverImageUrl = imageService.saveCoverImage(coverImage);

		// 2️⃣ 제목(title) 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getTitle())
				.filter(title -> !title.equals(book.getTitle()))
				.map(title -> { book.setTitle(title); return true; })
				.orElse(false);

		// 3️⃣ 커버 이미지(coverImage) 업데이트
		isUpdated |= Optional.ofNullable(coverImageUrl)
				.filter(image -> !coverImage.equals(book.getCoverImage()))
				.map(image -> { book.setCoverImage(image); return true; })
				.orElse(false);

		// 4️⃣ 태그(tags) 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getTags())
				.filter(tags -> !tags.equals(book.getTags()))
				.map(tags -> { book.setTags(tags); return true; })
				.orElse(false);

		// 5️⃣ Story ID 리스트 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getStoryIds())
				.filter(storyIds -> !storyIds.equals(book.getStoryIds()))
				.map(storyIds -> { book.setStoryIds(storyIds); return true; })
				.orElse(false);

		// ✅ 6️⃣ 본문(content) 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getContent())
				.filter(content -> !content.equals(book.getContent()))
				.map(content -> { book.setContent(convertContentToJson(escapeDots(content)));  return true; })
				.orElse(false);

		// ✅ 7️⃣ 변경 사항이 있으면 updatedAt 갱신 후 저장
		if (isUpdated) {
			book.setUpdatedAt(LocalDateTime.now());
			bookRepository.save(book);

			BookContent bookContent = bookContentRepository.findByBookId(requestDto.getBookId());
			bookContent.setContent(escapeDots(requestDto.getContent())); // MongoDB 저장용 변환 적용
			bookContentRepository.save(bookContent);

			// ✅ Elasticsearch 색인 업데이트 (검색 최적화를 위해)
			indexBookData(book, "book_title");
		}
	}

	// JSON 변환을 위한 헬퍼 메서드
	private BookContent parseJsonContent(String jsonContent, Long bookId) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {

			Map<String, String> contentMap = objectMapper.readValue(jsonContent, new TypeReference<Map<String, String>>() {});

			// ✅ 키 값에서 '.'을 '_DOT_'로 변환
			Map<String, String> sanitizedContent = new HashMap<>();
			for (Map.Entry<String, String> entry : contentMap.entrySet()) {
				String sanitizedKey = entry.getKey().replace(".", "_DOT_");
				sanitizedContent.put(sanitizedKey, entry.getValue());
			}

			BookContent bookContent = bookContentRepository.findByBookId(bookId);
			bookContent.setBookId(bookId);
			bookContent.setContent(contentMap);
			return bookContent;
		} catch (JsonProcessingException e) {
			throw new RuntimeException("JSON 변환 오류: " + e.getMessage(), e);
		}
	}


	@Transactional
	public void deleteBook(Long bookId) {
		bookRepository.deleteById(bookId);
		bookContentRepository.deleteByBookId(bookId);
		// ✅ Elasticsearch 색인 삭제
		deleteBookFromIndex(bookId, "book_title");
	}

	@Transactional
	public BookDetailResponseDto getBookDetail(Long bookId, UUID userId) {
		Book book = getBookById(bookId);
		viewBook(book, userId);

		boolean isLiked = isBookLiked(bookId, userId);
		Long likeCount = bookLikesRedisService.getLikeCount(bookId);
		Long viewCount = bookViewsRedisService.getViewCount(bookId);
		List<String> imageUrls = getImagesFromStories(book.getStoryIds());
		Map<String, String> bookContent = getBookContent(bookId);

		// ✅ 댓글 조회
		List<CommentResponseDto> comments = commentService.getCommentsByBookId(bookId).stream()
		  .map(comment -> new CommentResponseDto(
			comment.getId(),
			comment.getContent(),
			comment.getUsername(),
			comment.getCreatedAt(),
			comment.getUpdatedAt(),
			comment.getParentId()
		  ))
		  .collect(Collectors.toList());

		return BookDetailResponseDto.toResponseDto(
				book,
				bookContent,  // ✅ 순서 수정: contentJson
				isLiked,
				likeCount,
				viewCount,
				imageUrls,
				comments
		);
	}

	@Transactional
	public List<BookResponseDto> getLikedBooks(UUID userId) {
		return bookRepository.findLikedBooksByUserId(userId).stream()
		  .map(book -> mapToBookResponseDto(book, userId))
		  .collect(Collectors.toList());
	}

	@Transactional
	public List<BookResponseDto> getMyBooks(UUID userId) {
		return bookRepository.findMyBooksByUserId(userId).stream()
		  .map(book -> mapToBookResponseDto(book, userId))
		  .collect(Collectors.toList());
	}

	@Transactional
	public void viewBook(Book book, UUID userId) {
		Long bookId = book.getId();
		User user = getUSerById(userId);

		bookViewsRedisService.incrementViewCount(bookId);
		if (!bookViewsRepository.existsByBookIdAndUserId(bookId, userId)) {
			BookViews newView = BookViews.builder()
					.book(book)
					.user(user)
					.updatedAt(LocalDateTime.now())
					.build();

			bookViewsRepository.save(newView);
		}
		saveRecentView(user.getId(), bookId);
	}

	@Transactional(readOnly = true)
	public Map<String, String> getBookContent(Long bookId) {
		return Optional.ofNullable(bookContentRepository.findByBookId(bookId))
				.map(bookContent -> restoreDots(bookContent.getContent())) // ✅ '_DOT_' → '.' 복구
				.orElse(Collections.emptyMap()); // MongoDB에 값이 없을 경우 빈 Map 반환
	}

	// ✅ MongoDB 저장 시 '.' → '_DOT_' 변환
	private Map<String, String> escapeDots(Map<String, String> content) {
		Map<String, String> sanitizedContent = new HashMap<>();
		for (Map.Entry<String, String> entry : content.entrySet()) {
			String sanitizedKey = entry.getKey().replace(".", "_DOT_");
			sanitizedContent.put(sanitizedKey, entry.getValue());
		}
		return sanitizedContent;
	}

	// ✅ MongoDB 조회 후 '_DOT_' → '.' 복구
	private Map<String, String> restoreDots(Map<String, String> content) {
		Map<String, String> restoredContent = new HashMap<>();
		for (Map.Entry<String, String> entry : content.entrySet()) {
			String originalKey = entry.getKey().replace("_DOT_", ".");
			restoredContent.put(originalKey, entry.getValue());
		}
		return restoredContent;
	}




	@Transactional
	public List<BookResponseDto> getBooksByAuthorId(UUID authorId, UUID userId) {
		return bookRepository.findByAuthorId(authorId).stream()
		  .map(book -> mapToBookResponseDto(book, userId))
		  .collect(Collectors.toList());
	}

	@Transactional
	public List<BookResponseDto> getAllBooksSortedByTrends(UUID userId) {
		return bookRepository.getAllBooksSortedByTrends().stream()
		  .map(book -> mapToBookResponseDto(book, userId))
		  .collect(Collectors.toList());
	}

	@Transactional
	public List<BookResponseDto> getWeeklyTop3Books(UUID userId) {
		return bookRepository.getWeeklyTop3Books().stream()
		  .map(book -> mapToBookResponseDto(book, userId))
		  .collect(Collectors.toList());
	}

	@Transactional
	public boolean toggleLikeBook(Long bookId, UUID userId) {
		Book book = getBookById(bookId);
		User user = getUSerById(userId);
		boolean isLiked = toggleLike(userId);

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

	@Transactional
	public List<BookResponseDto> getBooksSortedByTrends(UUID userId) {
		// ✅ 트렌드 기반으로 책 목록 조회
		List<Book> books = bookRepository.getAllBooksSortedByTrends();

		return books.stream()
				.map(book -> {
					// ✅ Redis에서 좋아요 & 조회수 조회 (캐싱 활용)
					Long likeCount = bookLikesRedisService.getLikeCount(book.getId());
					Long viewCount = bookViewsRedisService.getViewCount(book.getId());
					Set<UUID> likedUsers = bookLikesRedisService.getLikedUsers(book.getId());

					// ✅ MongoDB에서 책 본문 조회
					Map<String, String> bookContent = getBookContent(book.getId());

					return mapToBookResponseDto(book, userId);
				})
				.collect(Collectors.toList());
	}

	public void indexBookData(Book book, String indexName) {
		try {
			Map<String, Object> bookData = new HashMap<>();
			bookData.put("id", book.getId());
			bookData.put("title", book.getTitle());
			bookData.put("authorId", book.getAuthor().getId());  // ✅ `UUID`만 저장
			bookData.put("tags", book.getTags());

			IndexRequest<Map<String, Object>> request = IndexRequest.of(i -> i
					.index(indexName)
					.id(book.getId().toString())
					.document(bookData)
			);

			esClient.index(request);
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 색인 오류", e);
		}
	}


	public void deleteBookFromIndex(Long bookId, String indexName) {
		try {
			esClient.delete(d -> d
					.index(indexName)
					.id(bookId.toString())
			);
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 색인 삭제 오류", e);
		}
	}

	// ✅ 책 제목 검색 기능 (Elasticsearch)
	public List<BookResponseDto> searchByBookTitle(String keyword, UUID userId) throws IOException {
		SearchRequest searchRequest = getSearchRequest("book_title", keyword);
		SearchResponse<Book> searchResponse = esClient.search(searchRequest, Book.class);

		List<Book> books = searchResponse.hits().hits().stream()
				.map(Hit::source)
				.filter(Objects::nonNull)
				.collect(Collectors.toList());

		return books.stream()
				.map(book -> mapToBookResponseDto(book, userId))
				.collect(Collectors.toList());
	}

	private SearchRequest getSearchRequest(String indexName, String keyword) {
		return SearchRequest.of(s -> s
				.index(indexName)  // ✅ "book_title" 인덱스에서 검색 수행
				.query(q -> q
						.match(m -> m
								.field("title")  // ✅ title 필드에서 검색
								.query(keyword)
						)
				)
		);
	}

	@Transactional
	public boolean toggleLikeBook(Long bookId, UUID userId) {
		Book book = getBookById(bookId);
		User user = getUserById(userId);

		Optional<BookLikes> existingLike = book.getBookLikes().stream()
		  .filter(like -> like.getUser().getId().equals(userId))
		  .findFirst();

		if (existingLike.isPresent()) {
			// 이미 좋아요를 눌렀으면 제거
			book.getBookLikes().remove(existingLike.get());
			bookLikesRepository.delete(existingLike.get());
			bookLikesRedisService.removeLike(bookId, userId);
			return false; // 좋아요 취소됨
		} else {
			// 좋아요 추가
			BookLikes newLike = BookLikes.builder()
			  .book(book)
			  .user(user)
			  .likedAt(LocalDateTime.now())
			  .build();

			book.getBookLikes().add(newLike);
			bookLikesRepository.save(newLike);
			bookLikesRedisService.addLike(bookId, userId);
			return true; // 좋아요 추가됨
		}
	}

	/**
	 * ✅ Book 엔티티를 BookResponseDto로 변환하는 공통 메서드
	 */
	private BookResponseDto mapToBookResponseDto(Book book, UUID userId) {
		// MongoDB에서 책 본문 조회
		Map<String, String> bookContent = getBookContent(book.getId());
		book.setContent(convertContentToJson(bookContent));

		Set<UUID> likedUserIds = book.getBookLikes()
		  .stream()
		  .map(BookLikes::getUser)
		  .map(User::getId)
		  .collect(Collectors.toSet());

		return BookResponseDto.toResponseDto(
				book,
				isBookLiked(book.getId(), userId),  // 좋아요 여부 확인
				bookLikesRedisService.getLikeCount(book.getId()), // 좋아요
		  		likedUserIds,
				bookViewsRedisService.getViewCount(book.getId())  // 조회 수
		);
	}

	private static String convertContentToJson(Map<String, String> content) {
		ObjectMapper objectMapper = new ObjectMapper();
		try {
			return objectMapper.writeValueAsString(content);
		} catch (JsonProcessingException e) {
			return "{}"; // JSON 변환 실패 시 빈 객체 반환
		}
	}

	private Book getBookById(Long bookId) {
		return bookRepository.findById(bookId)
				.orElseThrow(() -> new IllegalArgumentException("❌ 해당하는 봄날의 서가 없습니다!"));
	}

	private Book getBookById(Long bookId, UUID userId) {
		Book book = getBookById(bookId);
		validateOwner(book.getAuthor().getId(), userId);
		return book;
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
