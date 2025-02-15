package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.TimeUnit;

import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookAutocompleteResponseDto;
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
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.repository.CommentLikesRepository;
import org.ssafy.respring.domain.comment.service.CommentService;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDto;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.notification.service.NotificationService;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.service.UserService;
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
	private final CommentLikesRepository commentLikesRepository;
	@Lazy
	private final MongoBookContentRepository bookContentRepository;
	private final ObjectMapper objectMapper;

	private final CommentService commentService;
	private final ImageService imageService;
	private final BookViewsRedisService bookViewsRedisService;
	private final BookLikesRedisService bookLikesRedisService;
	private final NotificationService notificationService;
	private final UserService userService;

	private final RedisTemplate<String, Object> redisTemplate;
	private final ElasticsearchClient esClient;


	private static final String RECENT_VIEW_KEY = "user:recent:books:";
	private static final String BOOK_INDEX = "book_title";

	@Transactional
    public Long createBook(BookRequestDto requestDto, MultipartFile coverImage, UUID userId) {
        User user = getUserById(userId);
		validateUserStories(requestDto.getStoryIds(), userId);

        Book book = Book.builder()
                .author(user)
                .title(requestDto.getTitle())
                .tags(requestDto.getTags())
                .storyIds(requestDto.getStoryIds())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        bookRepository.save(book);

        String coverImageUrl = imageService.saveImage(coverImage, ImageType.BOOK, book.getId());
        book.setCoverImage(coverImageUrl);

        bookRepository.save(book);

		// ✅ Elasticsearch 색인 수행
		indexBookData(book);


		// ✅ MongoDB 키 변환 적용 ('.' → '_DOT_')
		LinkedHashMap<String, String> sanitizedContent = escapeDots(requestDto.getContent());

		BookContent bookContent = new BookContent();
		bookContent.setBookId(book.getId());
		bookContent.setContent(sanitizedContent); // ✅ 변환된 키 적용
		bookContentRepository.save(bookContent);

		// ✅ 새 책이 추가되었으므로 캐시 삭제
		clearTrendingBooksCache();

        return book.getId();
    }

	@Transactional
	public void updateBook(BookUpdateRequestDto requestDto, MultipartFile coverImage, UUID userId) {
		boolean isUpdated = false; // 변경 여부 추적

		// 1️⃣ 기존 책 조회 및 권한 검증
		Book book = getBookById(requestDto.getBookId(), userId);

		// 요청된 Story, user 유효성 검증 단계 추가
		validateUserStories(requestDto.getStoryIds(), userId);
		validateOwner(getBookById(requestDto.getBookId()).getAuthor().getId(), userId);

		// 2️⃣ 커버 이미지 처리
		String coverImageUrl = coverImage != null ? imageService.saveImage(coverImage,ImageType.BOOK,book.getId()) : book.getCoverImage();

		// 3️⃣ 제목(title) 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getTitle())
				.filter(title -> !title.equals(book.getTitle()))
				.map(title -> { book.setTitle(title); return true; })
				.orElse(false);

		// 4️⃣ 커버 이미지(coverImage) 업데이트
		isUpdated |= Optional.ofNullable(coverImageUrl)
				.filter(image -> !image.equals(book.getCoverImage()))
				.map(image -> { book.setCoverImage(image); return true; })
				.orElse(false);

		// 5️⃣ 태그(tags) 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getTags())
				.filter(tags -> !tags.equals(book.getTags()))
				.map(tags -> { book.setTags(tags); return true; })
				.orElse(false);

		// 6️⃣ Story ID 리스트 업데이트
		isUpdated |= Optional.ofNullable(requestDto.getStoryIds())
				.filter(storyIds -> !storyIds.equals(book.getStoryIds()))
				.map(storyIds -> { book.setStoryIds(storyIds); return true; })
				.orElse(false);

		// ✅ 7️⃣ 본문(content) 업데이트
		if (requestDto.getContent() != null) {
			BookContent bookContent = bookContentRepository.findByBookId(requestDto.getBookId());
			if (bookContent == null) {
				bookContent = new BookContent();
				bookContent.setBookId(requestDto.getBookId());
			}

			LinkedHashMap<String, String> sanitizedContent = escapeDots(requestDto.getContent());
			if (!sanitizedContent.equals(bookContent.getContent())) {
				bookContent.setContent(sanitizedContent);
				bookContentRepository.save(bookContent);
				isUpdated = true;
			}
		}

		// ✅ 8️⃣ 변경 사항이 있으면 updatedAt 갱신 후 저장
		if (isUpdated) {
			book.setUpdatedAt(LocalDateTime.now());
			bookRepository.save(book);

			// ✅ Elasticsearch 색인 업데이트 (검색 최적화를 위해)
			indexBookData(book);
		}
	}

	@Transactional
	public void deleteBook(Long bookId, UUID userId) {

		validateOwner(getBookById(bookId).getAuthor().getId(), userId);

		bookRepository.deleteById(bookId);
		bookContentRepository.deleteByBookId(bookId);

		// ✅ Elasticsearch 색인 삭제
		deleteBookFromIndex(bookId, "book_title");

		// ✅ 책이 삭제되었으므로 캐시 삭제
		clearTrendingBooksCache();
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
		Set<String> likedUsers = bookLikesRedisService.getLikedUsers(book.getId());
		String coverImageUrl = imageService.getSingleImageByEntity(ImageType.BOOK, bookId);

		User user = userRepository.findById(userId)
				.orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다!"));

		String authorProfileImage = imageService.generatePresignedUrl(user.getProfileImage());

		// ✅ 댓글 조회
		List<CommentDto> comments = commentService.getCommentsByBookId(bookId);

		return BookDetailResponseDto.toResponseDto(
				book,
				authorProfileImage,
				bookContent,  // ✅ 순서 수정: contentJson
				isLiked,
				likeCount,
		  		likedUsers,
				viewCount,
				imageUrls,
				comments,
				coverImageUrl
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
		User user = getUserById(userId);

		bookViewsRedisService.incrementViewCount(bookId);

		if (!bookViewsRepository.existsByBookIdAndUserId(bookId, userId)) {
			saveBookViewAsync(book, user);
		}
	}

	@Async
	@Transactional
	public void saveBookViewAsync(Book book, User user) {
		bookViewsRepository.save(BookViews.builder()
				.book(book)
				.user(user)
				.updatedAt(LocalDateTime.now())
				.build());
	}

	@Transactional(readOnly = true)
	public LinkedHashMap<String, String> getBookContent(Long bookId) {
		return Optional.ofNullable(bookContentRepository.findByBookId(bookId))
				.map(bookContent -> restoreDots(bookContent.getContent())) // ✅ '_DOT_' → '.' 복구
				.orElse(new LinkedHashMap<>()); // ✅ 빈 LinkedHashMap 반환
	}

	// ✅ MongoDB 저장 시 '.' → '_DOT_' 변환
	private LinkedHashMap<String, String> escapeDots(Map<String, String> content) {
		LinkedHashMap<String, String> sanitizedContent = new LinkedHashMap<>();
		for (Map.Entry<String, String> entry : content.entrySet()) {
			String sanitizedKey = entry.getKey().replace(".", "_DOT_");
			sanitizedContent.put(sanitizedKey, entry.getValue());
		}
		return sanitizedContent;
	}


	// ✅ MongoDB 조회 후 '_DOT_' → '.' 복구
	private LinkedHashMap<String, String> restoreDots(Map<String, String> content) {
		LinkedHashMap<String, String> restoredContent = new LinkedHashMap<>();
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

	// 무한스크롤 x
	@Transactional(readOnly = true)
	public List<BookResponseDto> getAllBooksSortedBy(String sortBy, boolean ascending, UUID userId) {
		return bookRepository.getAllBooksSortedBy(sortBy, ascending)
				.stream()
				.map(book -> mapToBookResponseDto(book, userId))
				.collect(Collectors.toList());
	}

	// 무한스크롤 버전
	@Transactional(readOnly = true)
	public List<BookResponseDto> getAllBooksSortedBy(
			String sortBy, boolean ascending, Long lastValue, LocalDateTime lastCreatedAt, Long lastId, int size, UUID userId) {

		return bookRepository.getAllBooksSortedBy(sortBy, ascending, lastValue, lastCreatedAt, lastId, size)
				.stream()
				.map(book -> mapToBookResponseDto(book, userId))
				.collect(Collectors.toList());
	}

	// 무한스크롤 적용 x
	@Transactional(readOnly = true)
	public List<BookResponseDto> getAllBooksSortedByTrends(UUID userId) {
		return bookRepository.getAllBooksSortedByTrends().stream()
				.map(book -> mapToBookResponseDto(book, userId))
				.collect(Collectors.toList());
	}

	// 무한스크롤 적용
	@Transactional(readOnly = true)
	public List<BookResponseDto> getAllBooksSortedByTrends(UUID userId, Long lastLikes, Long lastViews, LocalDateTime lastCreatedAt, Long lastBookId, int size) {
		// ✅ Redis 캐싱 키 생성 (페이지 단위 캐싱)
		String cacheKey = String.format("trending_books:%d:%d:%s:%d", lastLikes, lastViews, lastCreatedAt, size);

		// ✅ 캐시에서 조회
		List<BookResponseDto> cachedResult = (List<BookResponseDto>) redisTemplate.opsForValue().get(cacheKey);
		if (cachedResult != null) {
			System.out.println("✅ 캐시에서 불러옴: " + cacheKey);
			return cachedResult;
		}

		// ✅ 캐시에 없으면 DB 조회
		List<BookResponseDto> result = bookRepository.getAllBooksSortedByTrends(lastLikes, lastViews, lastCreatedAt, lastBookId, size)
				.stream()
				.map(book -> mapToBookResponseDto(book, userId))
				.collect(Collectors.toList());

		// ✅ Redis에 저장 (TTL 5분 설정)
		redisTemplate.opsForValue().set(cacheKey, result, 5, TimeUnit.MINUTES);

		return result;
	}

	@Transactional(readOnly = true)
	public List<BookResponseDto> getWeeklyTop3Books(UUID userId) {
		return bookRepository.getWeeklyTop3Books().stream()
		  .map(book -> mapToBookResponseDto(book, userId))
		  .collect(Collectors.toList());
	}

	public boolean isBookLiked(Long bookId, UUID userId) {
		return userId==null? false : bookLikesRedisService.isLiked(bookId, userId);
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

	public void indexBookData(Book book) {
		try {
			Map<String, Object> bookData = new HashMap<>();
			bookData.put("id", book.getId());

			// ✅ title을 그냥 문자열(String)로 저장
			bookData.put("title", book.getTitle());

			// ✅ 수정된 데이터 확인
			System.out.println("📌 수정된 색인 요청 데이터: " + bookData);

			IndexRequest<Map<String, Object>> request = IndexRequest.of(i -> i
					.index(BOOK_INDEX)
					.id(book.getId().toString())
					.document(bookData));

			esClient.index(request);
			System.out.println("✅ Elasticsearch 색인 성공: " + book.getTitle());
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 색인 오류", e);
		}
	}

	@Transactional
	public List<BookAutocompleteResponseDto> autocompleteBookTitle(String prefix) throws IOException {
		SearchRequest searchRequest = SearchRequest.of(s -> s
				.index(BOOK_INDEX)
				.query(q -> q
						.bool(b -> b
								.should(s1 -> s1.matchPhrasePrefix(mpp -> mpp // ✅ 입력한 prefix로 시작하는 제목 검색
										.field("title.autocomplete")
										.query(prefix)))
								.should(s2 -> s2.match(m -> m // ✅ 입력한 prefix가 제목 내 포함된 경우도 검색
										.field("title.autocomplete")
										.query(prefix)))
						)
				)
				.size(10) // ✅ 자동완성 결과 개수 제한
		);

		SearchResponse<Map> searchResponse = esClient.search(searchRequest, Map.class);
		return mapToBookAutocompleteResponseDtoList(searchResponse);
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

	public void clearTrendingBooksCache() {
		// ✅ "trending_books:"로 시작하는 모든 캐시 삭제
		Set<String> keys = redisTemplate.keys("trending_books:*");
		if (keys != null) {
			redisTemplate.delete(keys);
			System.out.println("✅ Redis 캐시 삭제 완료: " + keys.size() + "개 항목");
		}
	}


	// ✅ 책 제목 검색 기능 (Elasticsearch)
	@Transactional
	public List<BookResponseDto> searchByBookTitle(String keyword, UUID userId) throws IOException {
		SearchRequest searchRequest = getSearchRequest("book_title", keyword);
		SearchResponse<Map> searchResponse = esClient.search(searchRequest, Map.class);

		ObjectMapper objectMapper = new ObjectMapper();

		List<BookResponseDto> books = searchResponse.hits().hits().stream()
				.map(hit -> {
					try {
						System.out.println("✅ 검색 결과: " + hit.source());

						// ✅ Elasticsearch에서 변환
						BookResponseDto bookDto = objectMapper.convertValue(hit.source(), BookResponseDto.class);

						// ✅ Elasticsearch 결과에 ID가 없을 경우 _id 필드에서 가져오기
						if (bookDto.getId() == null) {
							bookDto.setId(Long.parseLong(hit.id()));
						}

						// ✅ Elasticsearch에서 누락된 데이터 보완
						return enrichBookResponseWithDB(bookDto, userId);
					} catch (Exception e) {
						System.err.println("❌ 검색 변환 오류: " + e.getMessage());
						return null;
					}
				})
				.filter(Objects::nonNull)
				.collect(Collectors.toList());

		return books;
	}

	// ✅ Elasticsearch에서 가져온 데이터에 DB 데이터 추가
	private BookResponseDto enrichBookResponseWithDB(BookResponseDto bookDto, UUID userId) {
		// ✅ DB에서 책 정보 조회
		Optional<Book> optionalBook = bookRepository.findById(bookDto.getId());

		if (optionalBook.isPresent()) {
			Book book = optionalBook.get();

			// ✅ Elasticsearch에서 빠진 데이터 보완
			bookDto.setCoverImage(book.getCoverImage());
			bookDto.setCreatedAt(book.getCreatedAt());
			bookDto.setUpdatedAt(book.getUpdatedAt());
		} else {
			System.err.println("❌ DB에서 책 ID " + bookDto.getId() + "를 찾을 수 없음.");
		}

		// ✅ Redis에서 좋아요 & 조회수 정보 보완
		return enrichBookResponse(bookDto, userId);
	}

	private BookResponseDto enrichBookResponse(BookResponseDto book, UUID userId) {
		Long likeCount = bookLikesRedisService.getLikeCount(book.getId());
		Long viewCount = bookViewsRedisService.getViewCount(book.getId());
		Set<String> likedUsers = bookLikesRedisService.getLikedUsers(book.getId());

		book.setLikeCount(likeCount);
		book.setViewCount(viewCount);
		book.setLikedUsers(likedUsers);
		book.setLiked(isBookLiked(book.getId(), userId)); // ✅ 사용자의 좋아요 여부 확인

		System.out.println(book);

		return book;
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

			// ✅ 자서전 작성자에게 알림 전송
			UUID authorId = book.getAuthor().getId();

			// ✅ 본인이 작성한 자서전에 좋아요를 누르면 알림을 보내지 않음
			if (!authorId.equals(userId)) {
				notificationService.sendNotification(
						authorId, // ✅ 알림 받는 사람 (자서전 작성자)
						NotificationType.LIKE,
						TargetType.BOOK,
						bookId,
						"📖 " + user.getUserNickname() + "님이 당신의 자서전을 좋아합니다!"
				);
			}

			// ✅ 캐시 삭제 후 최신 데이터 반영
			clearTrendingBooksCache();

			return true; // 좋아요 추가됨
		}
	}

	/**
	 * ✅ Book 엔티티를 BookResponseDto로 변환하는 공통 메서드
	 */
	private BookResponseDto mapToBookResponseDto(Book book, UUID userId) {
		// MongoDB에서 책 본문 조회
		Map<String, String> bookContent = getBookContent(book.getId());

		Set<String> likedUserNames = book.getBookLikes()
		  .stream()
		  .map(BookLikes::getUser)
		  .map(User::getUserNickname)
		  .collect(Collectors.toSet());

		return BookResponseDto.toResponseDto(
				book,
				isBookLiked(book.getId(), userId),
				bookLikesRedisService.getLikeCount(book.getId()), // 좋아요 수
				likedUserNames,
				bookViewsRedisService.getViewCount(book.getId()),
				imageService.getSingleImageByEntity(ImageType.BOOK,book.getId())
		);
	}

	private List<BookAutocompleteResponseDto> mapToBookAutocompleteResponseDtoList(SearchResponse<Map> searchResponse) {
		return searchResponse.hits().hits().stream()
				.map(hit -> {
					try {
						BookAutocompleteResponseDto bookDto = objectMapper.convertValue(hit.source(), BookAutocompleteResponseDto.class);
						if (bookDto.getId() == null) {
							bookDto.setId(Long.parseLong(hit.id())); // Elasticsearch에서 ID 값 가져오기
						}
						return bookDto;
					} catch (Exception e) {
						return null;
					}
				})
				.filter(Objects::nonNull)
				.collect(Collectors.toList());
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

	private User getUserById(UUID userId) {
		return userRepository.findById(userId)
				.orElseThrow(()-> new IllegalArgumentException("❌ 존재하지 않는 사용자입니다."));
	}

	private List<String> getImagesFromStories(List<Long> storyIds) {
		return storyIds.stream()
				.map(storyId -> imageService.getSingleImageByEntity(ImageType.STORY, storyId)) // ✅ 각 storyId에 대한 이미지 리스트 반환
				.filter(Objects::nonNull) // ✅ Null 값 제거
				.collect(Collectors.toList());
	}

	private void validateOwner(UUID correctId, UUID userId) {
		if (!correctId.equals(userId)) {
			throw new IllegalArgumentException("❌ 접근 권한이 없습니다!");
		}
	}

	// 자신의 story인지 확인하는 과정 (프론트에서 잘못된 값이 들어올 경우)
	private void validateUserStories(List<Long> storyIds, UUID userId) {
		List<Long> invalidStories = storyRepository.findAllById(storyIds).stream()
				.filter(story -> !story.getUser().getId().equals(userId))
				.map(story -> story.getId())
				.collect(Collectors.toList());

		if (!invalidStories.isEmpty()) {
			throw new IllegalArgumentException("❌ 잘못된 글조각입니다. 다시 선택해주세요!");
		}
	}
}
