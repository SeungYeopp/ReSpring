package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.util.BookMapper;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookSearchService {
    private final ElasticsearchClient esClient;
    private final BookMapper bookMapper;

    public List<BookResponseDto> searchByTitle(String keyword) throws IOException {
        SearchRequest searchRequest = SearchRequest.of(s -> s
                .index("books")
                .query(q -> q
                        .match(m -> m
                                .field("title")
                                .query(keyword)
                        )
                )
        );

        SearchResponse<Book> response = esClient.search(searchRequest, Book.class);

        return response.hits().hits().stream()
                .map(Hit::source)
                .filter(Objects::nonNull)
                .map(bookMapper::toResponseDto)
                .collect(Collectors.toList());
    }
}
