package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.repository.BookInfoRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.util.BookMapper;
import org.ssafy.respring.domain.story.repository.StoryRepository;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookSearchService {
    private final ElasticsearchClient esClient;
    private final BookMapper bookMapper;
    private final BookInfoRepository bookInfoRepository;
    private final StoryRepository storyRepository;

    public List<BookResponseDto> searchByTitle(String keyword, UUID userId) throws IOException {
        // Elasticsearch 검색 요청
        SearchRequest searchRequest = SearchRequest.of(s -> s
          .index("books")
          .query(q -> q.match(m -> m.field("title").query(keyword)))
        );
        SearchResponse<Book> response = esClient.search(searchRequest, Book.class);

        // 검색된 책 목록
        List<Book> books = response.hits().hits().stream()
          .map(Hit::source)
          .filter(Objects::nonNull)
          .collect(Collectors.toList());

        // ✅ 검색된 bookId 목록
        List<String> bookIds = books.stream().map(Book::getId).toList();

        // ✅ 로그인한 경우 좋아요 정보 조회
        Set<String> likedBookIds = userId != null
          ? new HashSet<>(bookInfoRepository.findLikedBookIdsByUser(userId, bookIds))
          : Set.of();

        return books.stream()
          .map(book -> bookMapper.toResponseDto(
            userId,
            book,
            null,  // ✅ BookInfo는 검색 결과에서 조회하지 않음
            likedBookIds.contains(book.getId()),  // ✅ 좋아요 여부 포함
            List.of(), // 댓글 정보 필요 없음
            List.of()  // 내용 속 이미지 필요 없음
          ))
          .collect(Collectors.toList());
    }
}
