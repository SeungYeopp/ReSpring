package org.ssafy.respring.domain.book.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.service.BookService;
import org.ssafy.respring.domain.book.vo.Book;

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
	public ResponseEntity<Long> createBook(@RequestBody BookRequestDto requestDto,
										   @RequestPart(value = "표지 이미지", required = false) MultipartFile coverImg) {
		return ResponseEntity.ok(bookService.createBook(requestDto, coverImg));
	}

	@PutMapping("/{book_id}")
	@Operation(summary = "봄날의 서(자서전) 수정", description = "특정 봄날의 서를 수정합니다.")
	public ResponseEntity<Void> updateBook(@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId,
										   @RequestBody BookRequestDto bookRequestDto,
										   @RequestPart(value = "표지 이미지", required = false) MultipartFile coverImg) {
		bookService.updateBook(bookId, bookRequestDto, coverImg);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/{book_id}")
	@Operation(summary = "봄날의 서(자서전) 삭제", description = "특정 봄날의 서를 삭제합니다.")
	public ResponseEntity<Void> deleteBook(@Parameter(description = "봄날의 서 ID") @PathVariable Long bookId) {
		bookService.deleteBook(bookId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	@Operation(summary = "모든 봄날의 서(자서전) 조회", description = "모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getAllBooks() {
		return ResponseEntity.ok(bookService.getAllBooks());
	}

	@GetMapping("/my")
	@Operation(summary = "나의 모든 봄날의 서(자서전) 조회", description = "나의 모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getMyBooks(@RequestHeader("X-User-Id") UUID userId) {
		return ResponseEntity.ok(bookService.getBooksByUser(userId));
	}

	@GetMapping("/{user_id}")
	@Operation(summary = "특정 유저가 작성한 모든 봄날의 서(자서전) 조회", description = "특정 유저가 작성한 모든 봄날의 서를 조회합니다.")
	public ResponseEntity<List<BookResponseDto>> getBooksByUser(@Parameter(description = "봄날의 서 ID") @PathVariable UUID userId) {
		return ResponseEntity.ok(bookService.getBooksByUser(userId));
	}

	@GetMapping("/{book_id}")
	@Operation(summary = "봄날의 서(자서전) 세부 조회", description = "특정 봄날의 서 내용을 조회합니다.")
	public ResponseEntity<BookResponseDto> getBookDetail(
	  @Parameter(description = "글 조각 ID") @PathVariable Long bookId) {
		return ResponseEntity.ok(bookService.getBookDetail(bookId));
	}
}
