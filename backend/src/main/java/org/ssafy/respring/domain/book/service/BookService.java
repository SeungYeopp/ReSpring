package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.dto.request.BookRequestDto;
import org.ssafy.respring.domain.book.dto.request.BookUpdateRequestDto;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;
import org.ssafy.respring.domain.book.util.BookMapper;
import org.ssafy.respring.domain.book.vo.Book;

import org.ssafy.respring.domain.image.service.ImageService;
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
	private final BookMapper bookMapper;
	private final ElasticsearchClient esClient;
	private final ImageService imageService;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public String createBook(BookRequestDto requestDto, MultipartFile coverImg) {
//		User user = userRepository.findById(requestDto.getUserId())
//				.orElseThrow(() -> new IllegalArgumentException("User not found with id: " + requestDto.getUserId()));

		Book book = new Book();
		book.setUserId(requestDto.getUserId());
		book.setTitle(requestDto.getTitle());
		book.setContent(requestDto.getContent());

		book.setTags(requestDto.getTags());
		book.setLikeCount(0L);
		book.setViewCount(0L);
//		book.setCoverImg(imageService.saveImageToDatabase(coverImg,"book_cover",null,null));
		book.setCreatedAt(LocalDateTime.now());
		book.setUpdatedAt(LocalDateTime.now());
		book.setStoryIds(requestDto.getStoryIds());

		if (coverImg != null && !coverImg.isEmpty()) {
			// ✅ 이미지 업로드 후 S3 객체 키만 저장
			String s3Key = imageService.saveImageToDatabase(coverImg, "book_covers", null, null);
			book.setCoverImg(s3Key);
		}

		bookRepository.save(book);

		// Elasticsearch에 인덱싱
		try {
			esClient.index(i -> i.index("books").id(book.getId()).document(book));
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 인덱싱 실패", e);
		}

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
		book.setTags(requestDto.getTags());
		book.setCoverImg(saveCoverImage(coverImg));

		book.setStoryIds(requestDto.getStoryIds());
		book.setUpdatedAt(LocalDateTime.now());

		bookRepository.save(book);

		// Elasticsearch에도 데이터 업데이트
		try {
			esClient.index(i -> i.index("books").id(book.getId()).document(book));
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 업데이트 실패", e);
		}
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
		Sort sort = Sort.by(Sort.Order.desc("likes")); // 좋아요 내림차순 정렬
		return bookRepository.findAll(sort)
				.stream()
				.map(bookMapper::toResponseDto)
				.collect(Collectors.toList());
	}

	public List<BookResponseDto> getBooksByUser(UUID userId) {
		return bookRepository.findByUserId(userId)
		  .stream()
		  .map(bookMapper::toResponseDto)
		  .collect(Collectors.toList());
	}

	public BookResponseDto getBookDetail(String bookId) {
		Book book = bookRepository.findById(bookId)
		  .orElseThrow(() -> new IllegalArgumentException("Book not found - id: " + bookId));

		book.increaseView();		// 조회수 + 1
		bookRepository.save(book);	// 조회수 업데이트 반영
		
		return bookMapper.toResponseDto(book);
	}

	public void deleteBook(String bookId, UUID userId) {
		Book book = bookRepository.findById(bookId)
				.orElseThrow(()-> new IllegalArgumentException("Book not found - id: "+ bookId));

		if (!book.getUserId().equals(userId)) {
			throw new IllegalArgumentException("You are not allowed to delete this book");
		}

		bookRepository.deleteById(bookId);

		// Elasticsearch에서도 삭제
		try {
			esClient.delete(d -> d.index("books").id(bookId));
		} catch (IOException e) {
			throw new RuntimeException("Elasticsearch 삭제 실패", e);
		}
	}

	private List<String> getImagesFromStories(List<Long> storyIds) {
		return storyRepository.findAllById(storyIds).stream()
				.flatMap(story -> story.getImages() != null ? story.getImages().stream() : List.<Image>of().stream())
				.map(Image::getS3Key)
				.collect(Collectors.toList());
	}

	public boolean toggleLike(String bookId, UUID userId) {
		Book book = bookRepository.findById(bookId)
				.orElseThrow(() -> new IllegalArgumentException("Book not found with id: " + bookId));

		boolean isLiked = book.toggleLike(userId); // 좋아요 토글
		bookRepository.save(book);
		return isLiked;
	}

	public List<BookResponseDto> getWeeklyTop3() {
		LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

		Pageable pageable = PageRequest.of(0, 3, Sort.by(
				Sort.Order.desc("likes"),  // 1순위: 좋아요 많은 순
				Sort.Order.desc("view"),   // 2순위: 조회수 많은 순
				Sort.Order.desc("createdAt") // 3순위: 최신순 (동일한 경우)
		));

		return bookRepository.findTop3ByCreatedAtAfter(oneWeekAgo, pageable)
				.stream()
				.map(bookMapper::toResponseDto)
				.collect(Collectors.toList());
	}


	public  List<BookResponseDto> getBooksSorted(List<String> sortFields, List<String> directions) {
		Sort sort = buildSort(sortFields, directions);
		return bookRepository.findAll(sort)
				.stream()
				.map(bookMapper::toResponseDto)
				.collect(Collectors.toList());
	}

	private Sort buildSort(List<String> sortFields, List<String> directions) {
		if (sortFields == null || sortFields.isEmpty()) {
			return Sort.unsorted();
		}

		Sort sort = Sort.unsorted();
		for (int i = 0; i < sortFields.size(); i++) {
			String field = sortFields.get(i);
			Sort.Direction direction = (i < directions.size() && "desc".equalsIgnoreCase(directions.get(i)))
					? Sort.Direction.DESC
					: Sort.Direction.ASC;

			sort = sort.and(Sort.by(direction, field));
		}

		return sort;
	}
}
