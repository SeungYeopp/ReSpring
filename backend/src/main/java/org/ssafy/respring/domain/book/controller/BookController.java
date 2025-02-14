package org.ssafy.respring.domain.book.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookSortRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookAutocompleteResponseDto;
import org.ssafy.respring.domain.book.dto.response.BookDetailResponseDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.service.BookService;
import org.ssafy.respring.domain.user.service.UserService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Books API", description = "봄날의 서(자서전) 관련 API")
public class BookController {

	private final BookService bookService;
	private final UserService userService;

	private UUID getUserIdFromSession(HttpSession session) {
		return (UUID) session.getAttribute("userId"); // 로그인 안 했으면 null 반환
	}

	private UUID requireLogin(HttpSession session) {
		UUID userId = getUserIdFromSession(session);
		if (userId == null) {
			throw new IllegalArgumentException("❌ 로그인이 필요합니다.");
		}
		return userId;
	}

	@PostMapping(consumes = {"multipart/form-data"})
	@Operation(summary = "봄날의 서(자서전) 생성", description = "새로운 봄날의 서를 생성합니다.")
	public ResponseEntity<Long> createBook(
			@RequestPart("requestDto") BookRequestDto requestDto,
			@RequestPart(value = "coverImg", required = false) MultipartFile coverImg,
			HttpSession session) {
		UUID userId = requireLogin(session);
		Long bookId = bookService.createBook(requestDto, coverImg, userId);
		return ResponseEntity.ok(bookId);
	}

	@PutMapping(path = "/{bookId}", consumes = {"multipart/form-data"})
	@Operation(summary = "봄날의 서(자서전) 수정", description = "특정 봄날의 서를 수정합니다.")
	public ResponseEntity<Void> updateBook(
			@RequestPart("requestDto") BookUpdateRequestDto requestDto,
			@RequestPart(value = "coverImg", required = false) MultipartFile coverImg,
			HttpSession session) {
		UUID userId = requireLogin(session);
		bookService.updateBook(requestDto, coverImg, userId);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{bookId}")
	@Operation(summary = "봄날의 서(자서전) 삭제", description = "특정 봄날의 서를 삭제합니다.")
	public ResponseEntity<Void> deleteBook(
			@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId,
			HttpSession session) {
		UUID userId = requireLogin(session);
		bookService.deleteBook(bookId, userId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/all/once")
	@Operation(summary = "모든 봄날의 서(자서전) 조회", description = "모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getAllBooks(
			HttpSession session
	) {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getAllBooksSortedByTrends(userId));
	}

	@GetMapping("/all")
	@Operation(summary = "모든 봄날의 서(자서전) 조회 - 무한 스크롤", description = "모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getAllBooksInfinite(
			HttpSession session,
			@RequestParam Long lastLikes,
			@RequestParam Long lastViews,
			@RequestParam Long lastBookId,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime lastCreatedAt,
			@RequestParam int size
	) {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getAllBooksSortedByTrends(userId, lastLikes, lastViews, lastCreatedAt, lastBookId, size));
	}

	@GetMapping("/my")
	@Operation(summary = "나의 모든 봄날의 서(자서전) 조회", description = "나의 모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getMyBooks(
			HttpSession session) {
		UUID userId = requireLogin(session);
		return ResponseEntity.ok(bookService.getMyBooks(userId));
	}

	@GetMapping("/user/{nickname}")
	@Operation(summary = "특정 유저가 작성한 모든 봄날의 서(자서전) 조회", description = "특정 유저가 작성한 모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getBooksByUser(
			@PathVariable String nickname, HttpSession session
	) {
		UUID authorId = userService.findByNickname(nickname).getId();
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getBooksByAuthorId(authorId, userId));
	}

	@GetMapping("/{bookId}")
	@Operation(summary = "봄날의 서(자서전) 세부 조회", description = "특정 봄날의 서 내용을 조회합니다.")
	public ResponseEntity<BookDetailResponseDto> getBookDetail(
			@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId,
			HttpSession session
	) {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getBookDetail(bookId, userId));
	}

	@PatchMapping("/likes/{bookId}")
	@Operation(summary = "좋아요 추가/취소", description = "특정 봄날의 서에 좋아요를 추가하거나 취소합니다.")
	public ResponseEntity<String> toggleLike(
			@Parameter(description = "좋아요를 추가/취소할 봄날의 서 ID") @PathVariable Long bookId,
			HttpSession session) {
		UUID userId = requireLogin(session);
		boolean isLiked = bookService.toggleLikeBook(bookId, userId);
		return ResponseEntity.ok(isLiked ? "Liked" : "Unliked");
	}

	@GetMapping("/all/sorted/once")
	@Operation(summary = "모든 봄날의 서 정렬", description = "모든 봄날의 서를 조회할 때 정렬 기준을 지정합니다.")
	public ResponseEntity<List<BookResponseDto>> getBooksSorted(
			@RequestParam String sortBy,
			@RequestParam(required = false, defaultValue = "desc") boolean ascending,
			HttpSession session) {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getAllBooksSortedBy(sortBy, ascending, userId));
	}

	@PostMapping("/all/sorted")
	@Operation(summary = "모든 봄날의 서 정렬 - 무한 스크롤 적용", description = "모든 봄날의 서를 조회할 때 정렬 기준을 지정합니다.")
	public ResponseEntity<List<BookResponseDto>> getBooksSorted(
			@RequestBody BookSortRequestDto requestDto,
			HttpSession session) {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getAllBooksSortedBy(
				requestDto.getSortBy(),
				requestDto.isAscending(),
				requestDto.getLastValue(),
				requestDto.getLastCreatedAt(),
				requestDto.getLastId(),
				requestDto.getSize(),
				userId
		));
	}


	@GetMapping("/weeklyTop3")
	@Operation(summary = "봄날의 서 주간 랭킹 Top3", description = "봄날의 서 주간 랭킹 Top3를 반환합니다.")
	public ResponseEntity<List<BookResponseDto>> getWeeklyTop3(
			HttpSession session
	) {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.getWeeklyTop3Books(userId));
	}

	@GetMapping("/search")
	@Operation(summary = "봄날의 서 제목 검색 (Elasticsearch)", description = "Elasticsearch에서 책 제목을 검색합니다.")
	public ResponseEntity<List<BookResponseDto>> searchBooks(
			@RequestParam String keyword,
			HttpSession session
	) throws IOException {
		UUID userId = getUserIdFromSession(session);
		return ResponseEntity.ok(bookService.searchByBookTitle(keyword, userId));
	}

	@GetMapping("/autocomplete/title")
	@Operation(summary = "봄날의 서 제목 자동완성 (Elasticsearch, 자동완성)", description = "Elasticsearch에서 책 제목을 검색할 때 자동완성을 지원합니다.")
	public ResponseEntity<List<BookAutocompleteResponseDto>> autocompleteBookTitle(
			@RequestParam String query
	) throws IOException {
		return ResponseEntity.ok(bookService.autocompleteBookTitle(query));
	}

	@GetMapping("/liked")
	@Operation(summary = "좋아요한 봄날의 서 목록 조회", description = "사용자가 좋아요한 책 목록을 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getLikedBooks(
			HttpSession session
	) {
		UUID userId = requireLogin(session);
		return ResponseEntity.ok(bookService.getLikedBooks(userId));
	}
}