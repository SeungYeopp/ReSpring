package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.ssafy.respring.domain.book.vo.Book;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

class  BookIndexServiceTest {
    private ElasticsearchClient esClient;
    private MongoTemplate mongoTemplate;
    private BookIndexService bookIndexService;

    @BeforeEach
    void setUp() {
        esClient = mock(ElasticsearchClient.class); // 가짜 ElasticsearchClient
        mongoTemplate = mock(MongoTemplate.class); // 가짜 MongoTemplate
        bookIndexService = new BookIndexService(esClient, mongoTemplate);
    }

    @Test
    void testIndexBooks() throws IOException {
        // 가짜 MongoDB 데이터 준비
        Book book1 = new Book();
        book1.setId("1");
        book1.setTitle("테스트 책 1");

        Book book2 = new Book();
        book2.setId("2");
        book2.setTitle("테스트 책 2");

        List<Book> mockBooks = Arrays.asList(book1, book2);

        // MongoDB에서 데이터를 가져올 때 가짜 데이터 반환
        when(mongoTemplate.findAll(Book.class, "book")).thenReturn(mockBooks);

        // 인덱싱 실행
        bookIndexService.indexBooks();

        // ArgumentCaptor를 사용하여 호출된 요청을 캡처 (제네릭 타입 명확히 지정)
        ArgumentCaptor<IndexRequest<Book>> indexCaptor = ArgumentCaptor.forClass((Class<IndexRequest<Book>>) (Class<?>) IndexRequest.class);

        // esClient.index()가 정확히 두 번 호출되었는지 검증
        verify(esClient, times(2)).index(indexCaptor.capture());

        // 캡처된 요청 리스트 가져오기
        List<IndexRequest<Book>> capturedRequests = indexCaptor.getAllValues();
        assertEquals(2, capturedRequests.size());

        // 개별 요청 검증
        assertEquals("1", capturedRequests.get(0).id());
        assertEquals("테스트 책 1", capturedRequests.get(0).document().getTitle());
        assertEquals("2", capturedRequests.get(1).id());
        assertEquals("테스트 책 2", capturedRequests.get(1).document().getTitle());
    }
}
