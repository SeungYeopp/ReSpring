package org.ssafy.respring.domain.book.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookDetailResponseDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.service.BookService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Books API", description = "봄날의 서(자서전) 관련 API")
public class BookController {

	private final BookService bookService;

	@PostMapping(consumes = {"multipart/form-data"})
	@Operation(summary = "봄날의 서(자서전) 생성", description = "새로운 봄날의 서를 생성합니다.")
	public ResponseEntity<Long> createBook(
			@RequestPart("requestDto") BookRequestDto requestDto,
			@RequestPart(value = "coverImg", required = false) MultipartFile coverImg) {
		Long bookId = bookService.createBook(requestDto);
		return ResponseEntity.ok(bookId);
	}

	@PutMapping(path = "/{bookId}", consumes = {"multipart/form-data"})
	@Operation(summary = "봄날의 서(자서전) 수정", description = "특정 봄날의 서를 수정합니다.")
	public ResponseEntity<Void> updateBook(
			@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId,
			@RequestPart("requestDto") BookUpdateRequestDto requestDto,
			@RequestPart(value = "coverImg", required = false) MultipartFile coverImg,
			@RequestHeader("X-User-Id") UUID userId) {
		bookService.updateBook(requestDto);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{bookId}")
	@Operation(summary = "봄날의 서(자서전) 삭제", description = "특정 봄날의 서를 삭제합니다.")
	public ResponseEntity<Void> deleteBook(
			@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId,
			@RequestHeader("X-User-Id") UUID userId) {
		bookService.deleteBook(bookId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/all")
	@Operation(summary = "모든 봄날의 서(자서전) 조회", description = "모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getAllBooks(
			@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getAllBooksSortedByTrends(userId));
	}

	@GetMapping("/my")
	@Operation(summary = "나의 모든 봄날의 서(자서전) 조회", description = "나의 모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getMyBooks(
			@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getMyBooks(userId));
	}

	@GetMapping("/user/{userId}")
	@Operation(summary = "특정 유저가 작성한 모든 봄날의 서(자서전) 조회", description = "특정 유저가 작성한 모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getBooksByUser(
			@Parameter(description = "유저 ID") @PathVariable UUID userId) {
		return ResponseEntity.ok(bookService.getBooksByAuthorId(userId, userId));
	}

	@GetMapping("/{bookId}")
	@Operation(summary = "봄날의 서(자서전) 세부 조회", description = "특정 봄날의 서 내용을 조회합니다.")
	public ResponseEntity<BookDetailResponseDto> getBookDetail(
			@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId,
			@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getBookDetail(bookId, userId));
	}

	@PatchMapping("/likes/{bookId}")
	@Operation(summary = "좋아요 추가/취소", description = "특정 봄날의 서에 좋아요를 추가하거나 취소합니다.")
	public ResponseEntity<String> toggleLike(
			@Parameter(description = "좋아요를 추가/취소할 봄날의 서 ID") @PathVariable Long bookId,
			@RequestHeader("X-User-Id") UUID userId) {
		boolean isLiked = bookService.toggleLikeBook(bookId, userId);
		return ResponseEntity.ok(isLiked ? "Liked" : "Unliked");
	}

	@GetMapping("/all/sorted")
	@Operation(summary = "모든 봄날의 서 정렬", description = "모든 봄날의 서를 조회할 때 정렬 기준을 지정합니다.")
	public ResponseEntity<List<BookResponseDto>> getBooksSorted(
			@RequestParam List<String> sortFields,
			@RequestParam(required = false, defaultValue = "desc") List<String> directions,
			@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getBooksSortedByTrends(userId));
	}

	@GetMapping("/weeklyTop3")
	@Operation(summary = "봄날의 서 주간 랭킹 Top3", description = "봄날의 서 주간 랭킹 Top3를 반환합니다.")
	public ResponseEntity<List<BookResponseDto>> getWeeklyTop3(
			@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getWeeklyTop3Books(userId));
	}

	@GetMapping("/search")
	@Operation(summary = "봄날의 서 제목 검색 (Elasticsearch)", description = "Elasticsearch에서 책 제목을 검색합니다.")
	public ResponseEntity<List<BookResponseDto>> searchBooks(
			@RequestParam String keyword,
			@RequestHeader("X-User-Id") UUID userId) throws IOException {
		return ResponseEntity.ok(bookService.searchByBookTitle(keyword, userId));
	}

	@GetMapping("/liked")
	@Operation(summary = "좋아요한 봄날의 서 목록 조회", description = "사용자가 좋아요한 책 목록을 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getLikedBooks(
			@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getLikedBooks(userId));
	}
}