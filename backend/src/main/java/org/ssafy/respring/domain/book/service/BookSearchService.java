package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.repository.BookInfoRepository;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.util.BookMapper;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;
import org.ssafy.respring.domain.book.vo.BookInfo;

@Service
@RequiredArgsConstructor
public class BookSearchService {
    private final ElasticsearchClient esClient;
    private final BookMapper bookMapper;
    private final MongoBookRepository bookRepository;
    private final BookInfoRepository bookInfoRepository;

    public List<BookResponseDto> searchByTitle(String keyword) throws IOException {
        SearchRequest searchRequest = SearchRequest.of(s -> s
                .index("books")
                .query(q -> q.match(m -> m.field("title").query(keyword))));
        SearchResponse<Book> response = esClient.search(searchRequest, Book.class);

        return response.hits().hits().stream()
                .map(Hit::source)
                .filter(Objects::nonNull)
                .map(book -> bookMapper.toResponseDto(
                        null, // No user ID required for search results
                        book,
                        null, // No BookInfo available in search results
                        false, // Like status unknown
                        List.of(), // No comments needed
                        List.of() // No image URLs needed
                ))
                .collect(Collectors.toList());
    }

    public List<BookResponseDto> getAllBooks() {
        Sort sort = Sort.by(Sort.Order.desc("likeCount"));
        return bookRepository.findAll(sort).stream()
                .map(bookMapper::toResponseDto)
                .collect(Collectors.toList());
    }

//    public List<BookResponseDto> getAllBooks(UUID userId) {
//        Sort sort = Sort.by(Sort.Order.desc("likeCount")); // 좋아요 내림차순 정렬
//
//        return bookRepository.findAll(sort)
//                .stream()
//                .map(book -> {
//                    BookInfo bookInfo = getBookInfoByBookId(book.getId());
//                    return getBookResponse(book.getUserId(), book, bookInfo);
//                })
//                .collect(Collectors.toList());
//    }

    public List<BookResponseDto> getBooksByUser(UUID userId) {
        return bookRepository.findByUserId(userId).stream()
                .map(bookMapper::toResponseDto)
                .collect(Collectors.toList());
    }

//    public List<BookResponseDto> getBooksByUser(UUID userId) {
//        return bookRepository.findByUserId(userId)
//                .stream()
//                .map(book -> {
//                    BookInfo bookInfo = getBookInfoByBookId(book.getId());
//                    return getBookResponse(userId, book, bookInfo);
//                })
//                .collect(Collectors.toList());
//    }

    public  List<BookResponseDto> getBooksSorted(List<String> sortFields, List<String> directions) {
        Sort sort = buildSort(sortFields, directions);
        return bookRepository.findAll(sort).stream()
                .map(book -> {
                    BookInfo bookInfo = getBookInfoByBookId(book.getId());
                    return getBookResponse(book.getUserId(), book, bookInfo);
                })
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



    public List<BookResponseDto> getWeeklyTop3() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        Pageable pageable = PageRequest.of(0, 3, Sort.by(
                Sort.Order.desc("likeCount"),
                Sort.Order.desc("viewCount"),
                Sort.Order.desc("createdAt")
        ));

        return bookRepository.findTop3ByCreatedAtAfter(oneWeekAgo, pageable)
                .stream()
                .map(bookMapper::toResponseDto)
                .collect(Collectors.toList());
    }

//    public List<BookResponseDto> getWeeklyTop3() {
//        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
//
//        Pageable pageable = PageRequest.of(0, 3, Sort.by(
//                Sort.Order.desc("likeCount"),  // 1순위: 좋아요 많은 순
//                Sort.Order.desc("viewCount"),   // 2순위: 조회수 많은 순
//                Sort.Order.desc("createdAt") // 3순위: 최신순 (동일한 경우)
//        ));
//
//        return bookRepository.findTop3ByCreatedAtAfter(oneWeekAgo, pageable)
//                .stream()
//                .map(book -> {
//                    BookInfo bookInfo = getBookInfoByBookId(book.getId());
//                    return getBookResponse(book.getUserId(), book, bookInfo);
//                })
//                .collect(Collectors.toList());
//    }


    private BookInfo getBookInfoByBookId(String bookId, UUID userId) {
        return bookInfoRepository.findByBookId(bookId)
                .orElseThrow(() -> new IllegalArgumentException("⚠️ 잘못된 Book Id입니다!"));
    }

    private void validateOwner(UUID correctId, UUID userId) {
        if (!correctId.equals(userId)) {
            throw new IllegalArgumentException("❌ 접근 권한이 없습니다!");
        }
    }
}
