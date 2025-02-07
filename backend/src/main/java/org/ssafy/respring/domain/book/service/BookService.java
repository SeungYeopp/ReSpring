package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.TimeUnit;

import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookDetailResponseDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.bookRepo.BookLikesRepository;
import org.ssafy.respring.domain.book.repository.bookRepo.BookRepository;
import org.ssafy.respring.domain.book.repository.bookRepo.BookViewsRepository;

import org.ssafy.respring.domain.book.repository.chapterRepo.ChapterRepository;
import org.ssafy.respring.domain.book.vo.Book;

import org.ssafy.respring.domain.book.vo.BookLikes;
import org.ssafy.respring.domain.book.vo.BookViews;
import org.ssafy.respring.domain.book.vo.Chapter;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.service.CommentService;
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

	private final ChapterService chapterService;
	private final CommentService commentService;
	private final BookViewsRedisService bookViewsRedisService;
	private final BookLikesRedisService bookLikesRedisService;
	private final RedisTemplate<String, Object> redisTemplate;
	private final ElasticsearchClient esClient;

	private static final String RECENT_VIEW_KEY = "user:recent:books:";

	@Transactional
	public Long createBook(BookRequestDto requestDto) {
		User user = getUSerById(requestDto.getUserId());

		Book book = Book.builder()
				.author(user)
				.title(requestDto.getTitle())
				.coverImage(requestDto.getCoverImage())
				.tags(requestDto.getTags())
		  		.chapters(requestDto.getChapters())
		  		.storyIds(requestDto.getStoryIds())
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build();

		// 챕터 저장
		List<Chapter> chapters = requestDto.getChapters().stream()
				.map(chapterDto -> Chapter.builder()
						.bookId(book.getId())
						.chapterTitle(chapterDto.getChapterTitle())
						.chapterContent(chapterDto.getChapterContent())
						.build())
				.collect(Collectors.toList());

		chapterRepository.saveAll(chapters);
		bookRepository.save(book);

		// ✅ Elasticsearch 색인 수행
		indexBookData(book, "book_title");

		return book.getId();
	}

	@Transactional
	public void updateBook(BookUpdateRequestDto requestDto) {
		// ✅ 1️⃣ 기존 책 조회 및 권한 검증
		Book book = getBookById(requestDto.getBookId(), requestDto.getUserId());

		boolean isUpdated = false; // 변경 여부 추적

		// ✅ 2️⃣ ChapterService를 이용하여 챕터 업데이트
		if (requestDto.getChapters() != null) {
			chapterService.updateChapters(book, requestDto.getChapters());
			isUpdated = true; // 챕터 업데이트가 일어남
		}

		// ✅ 3️⃣ 기존 book 엔티티에 변경 사항 적용
		isUpdated |= Optional.ofNullable(requestDto.getTitle())
		  .filter(title -> !title.equals(book.getTitle()))
		  .map(title -> { book.setTitle(title); return true; })
		  .orElse(false);

		isUpdated |= Optional.ofNullable(requestDto.getCoverImage())
		  .filter(coverImage -> !coverImage.equals(book.getCoverImage()))
		  .map(coverImage -> { book.setCoverImage(coverImage); return true; })
		  .orElse(false);

		isUpdated |= Optional.ofNullable(requestDto.getTags())
		  .filter(tags -> !tags.equals(book.getTags()))
		  .map(tags -> { book.setTags(tags); return true; })
		  .orElse(false);

		isUpdated |= Optional.ofNullable(requestDto.getStoryIds())
		  .filter(storyIds -> !storyIds.equals(book.getStoryIds()))
		  .map(storyIds -> { book.setStoryIds(storyIds); return true; })
		  .orElse(false);

		// ✅ 4️⃣ 변경 사항이 있는 경우에만 저장
		if (isUpdated) {
			book.setUpdatedAt(LocalDateTime.now());
			bookRepository.save(book);
			indexBookData(book, "book_title");
		}
	}

	@Transactional
	public void deleteBook(Long bookId) {
		bookRepository.deleteById(bookId);
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
		String bookContent = chapterService.getBookContent(bookId);

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
		  isLiked,
		  likeCount,
		  viewCount,
		  imageUrls,
		  comments,
		  bookContent
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
		boolean isLiked = book.toggleLike(userId);

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

					return BookResponseDto.toResponseDto(
							book,
							isBookLiked(book.getId(), userId),  // ✅ 좋아요 여부 확인
							likeCount,
							viewCount
					);
				})
				.collect(Collectors.toList());
	}

	public void indexBookData(Book book, String indexName) {
		try {
			IndexRequest<Book> request = IndexRequest.of(i -> i
					.index(indexName)
					.id(book.getId().toString())
					.document(book)
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

	// ✅ 책 제목 검색 기능 추가 (Elasticsearch 활용)
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


	/**
	 * ✅ Book 엔티티를 BookResponseDto로 변환하는 공통 메서드
	 */
	private BookResponseDto mapToBookResponseDto(Book book, UUID userId) {
		return BookResponseDto.toResponseDto(
		  book,
		  isBookLiked(book.getId(), userId), // ✅ 좋아요 여부 확인
		  bookLikesRedisService.getLikeCount(book.getId()),
		  bookViewsRedisService.getViewCount(book.getId())
		);
	}

	private Book getBookById(Long bookId) {
		return bookRepository.findById(bookId)
				.orElseThrow(() -> new IllegalArgumentException("❌ 해당하는 봄날의 서가 없습니다!"));
	}

	private Book getBookById(Long bookId, UUID userId) {
		Book book = getBookById(bookId);
		validateOwner(book.getAuthor().getUserId(), userId);
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
