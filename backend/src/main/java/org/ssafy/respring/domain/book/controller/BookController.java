package org.ssafy.respring.domain.book.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.book.dto.BookRequestDto;
import org.ssafy.respring.domain.book.service.BookService;
import org.ssafy.respring.domain.book.vo.Book;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Books API", description = "봄날의 서(자서전) 관련 API")
public class BookController {
	private final BookService bookService;

	// Create
	@PostMapping
	@Operation(summary = "봄날의 서(자서전) 생성", description = "새로운 봄날의 서를 생성합니다.")
	public ResponseEntity<String> createBook(@RequestBody BookRequestDto requestDto) {
		return ResponseEntity.ok(bookService.createBook(requestDto));
	}

	// Update
	@PutMapping("/{book_id}")
	public ResponseEntity<Void> updateBook(@Parameter(description = "봄날의 서 ID") @PathVariable String bookId,
										   @RequestBody BookRequestDto bookRequestDto) {
		bookService.updateBook(bookId, bookRequestDto);
		return ResponseEntity.ok().build();
	}

	// Delete
	@DeleteMapping("/{book_id}")
	public ResponseEntity<Void> deleteBook(@Parameter(description = "봄날의 서 ID") @PathVariable String bookId) {
		bookService.deleteBook(bookId);
		return ResponseEntity.noContent().build();
	}
}
