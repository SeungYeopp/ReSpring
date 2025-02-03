package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.ssafy.respring.domain.book.dto.response.BookResponseDto;
import org.ssafy.respring.domain.book.util.BookMapper;
import org.ssafy.respring.domain.book.vo.Book;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class BookSearchServiceTest {
    private ElasticsearchClient esClient;
    private BookMapper bookMapper;
    private BookSearchService bookSearchService;

    @BeforeEach
    void setUp() {
        esClient = mock(ElasticsearchClient.class); // 가짜 ElasticsearchClient
        bookMapper = mock(BookMapper.class); // 가짜 BookMapper
        bookSearchService = new BookSearchService(esClient, bookMapper);
    }

    @Test
    void testSearchByTitle() throws IOException {
        // 가짜 데이터 준비
        Book book1 = new Book();
        book1.setId("1");
        book1.setTitle("테스트 책 1");

        Book book2 = new Book();
        book2.setId("2");
        book2.setTitle("테스트 책 2");

        // ✅ Elasticsearch에서 반환할 가짜 SearchResponse 생성 (took, timedOut, shards 추가!)
        List<Hit<Book>> fakeHits = Arrays.asList(
          Hit.of(h -> h
            .index("books")
            .id("1")
            .source(book1)
          ),
          Hit.of(h -> h
            .index("books")
            .id("2")
            .source(book2)
          )
        );

        SearchResponse<Book> fakeResponse = SearchResponse.of(r -> r
          .took(0L)  // ✅ 필수 속성 추가!
          .timedOut(false)  // ✅ 필수 속성 추가!
          .shards(s -> s
            .total(1)  // ✅ 총 샤드 개수
            .successful(1)  // ✅ 성공한 샤드 개수
            .failed(0)  // ✅ 실패한 샤드 개수
          )
          .hits(h -> h.hits(fakeHits))
        );

        // ✅ `when()`을 사용할 때, 정확한 메서드 매칭을 위해 `thenAnswer()` 사용
        when(esClient.search(any(SearchRequest.class), eq(Book.class)))
          .thenAnswer(invocation -> fakeResponse);

        // ✅ BookMapper도 가짜 데이터 변환하도록 설정
        when(bookMapper.toResponseDto(book1))
          .thenReturn(new BookResponseDto(
            "1",
            UUID.randomUUID(),
            "테스트 책 1",
            "테스트 내용 1",
            "https://example.com/image1.jpg",
            Set.of("태그1", "태그2"),
            10L, // 좋아요 수
            100L, // 조회수
            LocalDateTime.now(), // 생성일
            LocalDateTime.now(), // 수정일
            Set.of(1L, 2L), // 스토리 ID
            Set.of("이미지1", "이미지2")
          ));

        when(bookMapper.toResponseDto(book2))
          .thenReturn(new BookResponseDto(
            "2",
            UUID.randomUUID(),
            "테스트 책 2",
            "테스트 내용 2",
            "https://example.com/image2.jpg",
            Set.of("태그3", "태그4"),
            5L, // 좋아요 수
            50L, // 조회수
            LocalDateTime.now(), // 생성일
            LocalDateTime.now(), // 수정일
            Set.of(3L, 4L), // 스토리 ID
            Set.of("이미지3", "이미지4")
          ));

        // 검색 메서드 실행
        List<BookResponseDto> result = bookSearchService.searchByTitle("테스트");

        // 검증
        assertEquals(2, result.size());
        assertEquals("1", result.get(0).getId());
        assertEquals("테스트 책 1", result.get(0).getTitle());
        assertEquals("2", result.get(1).getId());
        assertEquals("테스트 책 2", result.get(1).getTitle());

        // ✅ esClient.search()가 정확히 한 번 호출되었는지 검증
        ArgumentCaptor<SearchRequest> searchRequestCaptor = ArgumentCaptor.forClass(SearchRequest.class);
        verify(esClient, times(1)).search(searchRequestCaptor.capture(), eq(Book.class));

        // ✅ 실제 요청된 검색 요청이 올바르게 전달되었는지 확인
        SearchRequest capturedRequest = searchRequestCaptor.getValue();
        assertNotNull(capturedRequest);
    }
}
