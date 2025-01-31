package org.ssafy.respring.domain.book.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;
import org.ssafy.respring.domain.book.vo.Book;

import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.story.repository.StoryRepository;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {
	private final MongoBookRepository bookRepository;
	private final StoryRepository storyRepository;
	// private final UserRepository userRepository;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public String createBook(BookRequestDto requestDto, MultipartFile coverImg) {
//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

		Book book = new Book();
		book.setUserId(requestDto.getUserId());
		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());

		book.setTag(requestDto.getTag());
		book.setLikes(0L);
		book.setView(0L);
		book.setCoverImg(saveCoverImage(coverImg));

		book.setCreatedAt(LocalDateTime.now());
		book.setUpdatedAt(LocalDateTime.now());
		book.setStoryIds(requestDto.getStoryIds());

		bookRepository.save(book);
		return book.getId();
	}

	public void updateBook(String bookId, BookUpdateRequestDto requestDto, MultipartFile coverImg, UUID userId) {
		Book book = bookRepository.findById(bookId)
		  				.orElseThrow(()-> new IllegalArgumentException("Book not found - id: "+ bookId));

		if (!book.getUserId().equals(userId)) {
			throw new IllegalArgumentException("You are not allowed to update this book");
		}

		// 자신의 story인지 확인하는 과정
		boolean isValidStories = requestDto.getStoryIds().stream()
				.allMatch(storyId -> storyRepository.findById(storyId)
						.map(story -> story.getUser().getId().equals(userId))
						.orElse(false));

		if (!isValidStories) {
			throw new IllegalArgumentException("One or more stories do not belong to the user.");
		}

		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());
		book.setTag(requestDto.getTag());
		book.setCoverImg(saveCoverImage(coverImg));

		book.setStoryIds(requestDto.getStoryIds());
		book.setUpdatedAt(LocalDateTime.now());

		bookRepository.save(book);
	}

	private String saveCoverImage(MultipartFile coverImg) {
		if (coverImg == null || coverImg.isEmpty()) {
			return null;
		}

		File uploadDirFolder = new File(uploadDir);
		if (!uploadDirFolder.exists() && !uploadDirFolder.mkdirs()) {
			throw new RuntimeException("Failed to create upload directory: " + uploadDir);
		}

		try {
			String extension = coverImg.getOriginalFilename() != null
					? coverImg.getOriginalFilename().substring(coverImg.getOriginalFilename().lastIndexOf("."))
					: "";
			String uniqueFileName = UUID.randomUUID() + extension;
			File file = new File(uploadDirFolder, uniqueFileName);

			coverImg.transferTo(file);
			return file.getAbsolutePath();
		} catch (IOException e) {
			throw new RuntimeException("Failed to save file: " + coverImg.getOriginalFilename(), e);
		}
	}

	public List<BookResponseDto> getAllBooks() {
		return bookRepository.findAll()
		  .stream()
		  .map(this::toResponseDto)
		  .collect(Collectors.toList());
	}

	public List<BookResponseDto> getBooksByUser(UUID userId) {
		return bookRepository.findByUserId(userId)
		  .stream()
		  .map(this::toResponseDto)
		  .collect(Collectors.toList());
	}

	public BookResponseDto getBookDetail(String bookId) {
		Book book = bookRepository.findById(bookId)
		  .orElseThrow(() -> new IllegalArgumentException("Book not found - id: " + bookId));
		return toResponseDto(book);
	}

	public void deleteBook(String bookId, UUID userId) {
		Book book = bookRepository.findById(bookId)
				.orElseThrow(()-> new IllegalArgumentException("Book not found - id: "+ bookId));

		if (!book.getUserId().equals(userId)) {
			throw new IllegalArgumentException("You are not allowed to delete this book");
		}

		bookRepository.deleteById(bookId);
	}

	private List<String> getImagesFromStories(List<Long> storyIds) {
		return storyRepository.findAllById(storyIds).stream()
				.flatMap(story -> story.getImages() != null ? story.getImages().stream() : List.<Image>of().stream())
				.map(Image::getImageUrl)
				.collect(Collectors.toList());
	}


	private BookResponseDto toResponseDto(Book book) {
		return new BookResponseDto(
		  book.getId(),
		  book.getUserId(),
		  book.getTitle(),
		  book.getContent(),
		  book.getCoverImg(),
		  book.getTag(),
		  book.getLikes(),
		  book.getView(),
		  book.getCreatedAt(),
		  book.getUpdatedAt(),
		  book.getStoryIds(),
		  getImagesFromStories(book.getStoryIds())
		);
	}
}
