package org.ssafy.respring.domain.book.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.dto.BookRequestDto;
import org.ssafy.respring.domain.book.repository.BookRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
	private final BookRepository bookRepository;
	// private final UserRepository userRepository;

	public String createBook(BookRequestDto requestDto) {
//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));
		User user = new User();
		user.setId(requestDto.getUserId());

		Book book = new Book();
		book.setUser(user);
		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());
		book.setCoverImg(requestDto.getCoverImg());
		book.setTag(requestDto.getTag());
		book.setLikes(requestDto.getLikes());
		book.setView(requestDto.getView());
		book.setCreatedAt(LocalDateTime.now());
		book.setUpdatedAt(LocalDateTime.now());

		bookRepository.save(book);
		return book.getId();
	}

	public void updateBook(String bookId, BookRequestDto requestDto) {
		Book book = bookRepository.findById(bookId)
		  				.orElseThrow(()-> new IllegalArgumentException("Book not found - id: "+ bookId));
		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());
		book.setCoverImg(requestDto.getCoverImg());
		book.setTag(requestDto.getTag());

		book.setUpdatedAt(LocalDateTime.now());
	}

	public void deleteBook(String bookId) {
		if (!bookRepository.existsById(bookId)) {
			throw new IllegalArgumentException("Book not found");
		}
		bookRepository.deleteById(bookId);
	}
}
