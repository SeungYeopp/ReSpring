package org.ssafy.respring.domain.book.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.IndexRequest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.vo.Book;

import java.io.IOException;
import java.util.List;

@Service
public class BookIndexService {
    private final ElasticsearchClient esClient;
    private final MongoTemplate mongoTemplate;

    public BookIndexService(ElasticsearchClient esClient, MongoTemplate mongoTemplate) {
        this.esClient = esClient;
        this.mongoTemplate = mongoTemplate;
    }

    public void indexBooks() throws IOException {
        List<Book> books = mongoTemplate.findAll(Book.class, "book"); // MongoDB에서 데이터 가져오기

        for (Book book : books) {
            IndexRequest<Book> request = IndexRequest.of(i -> i
                    .index("books")
                    .id(book.getId())
                    .document(book)
            );

            esClient.index(request);
        }
    }
}
