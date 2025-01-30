package org.ssafy.respring.domain.book.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.common.counter.service.CounterService;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.story.repository.StoryRepository;
import org.ssafy.respring.domain.story.vo.Story;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookService {
	private final MongoBookRepository bookRepository;
	private final StoryRepository storyRepository;
	private final CounterService counterService;
	// private final UserRepository userRepository;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public Long createBook(BookRequestDto requestDto, MultipartFile coverImg) {
//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

		Book book = new Book();
		book.setId(counterService.getNextSequence("book"));
		book.setUserId(requestDto.getUserId());
		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());

		book.setTag(requestDto.getTag());
		book.setLikes(requestDto.getLikes());
		book.setView(requestDto.getView());
		book.setCoverImg(saveCoverImage(coverImg));

		book.setCreatedAt(LocalDateTime.now());
		book.setUpdatedAt(LocalDateTime.now());
		book.setStoryIds(requestDto.getStoryIds());
		bookRepository.save(book);
		return book.getId();
	}

	public void updateBook(Long bookId, BookRequestDto requestDto, MultipartFile coverImg) {
		Book book = bookRepository.findById(bookId)
		  				.orElseThrow(()-> new IllegalArgumentException("Book not found - id: "+ bookId));
		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());
		book.setTag(requestDto.getTag());
		book.setCoverImg(saveCoverImage(coverImg));

		book.setStoryIds(requestDto.getStoryIds());
		book.setUpdatedAt(LocalDateTime.now());
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
			String originalFileName = coverImg.getOriginalFilename();
			String extension = (originalFileName != null && originalFileName.contains(".")) ?
			  originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
			String uniqueFileName = UUID.randomUUID().toString() + extension;

			String filePath = uploadDir + File.separator + uniqueFileName;
			coverImg.transferTo(new File(filePath));

			return filePath;
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

	public BookResponseDto getBookDetail(Long bookId) {
		Book book = bookRepository.findById(bookId)
		  .orElseThrow(() -> new IllegalArgumentException("Book not found - id: " + bookId));
		return toResponseDto(book);
	}

	public void deleteBook(Long bookId) {
		if (!bookRepository.existsById(bookId)) {
			throw new IllegalArgumentException("Book not found - id: " + bookId);
		}
		bookRepository.deleteById(bookId);
	}

	private List<String> getImagesFromStories(List<Long> storyIds) {
		List<Story> stories = storyRepository.findAllById(storyIds);
		return stories.stream()
		  .flatMap(story -> story.getImages().stream())
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
