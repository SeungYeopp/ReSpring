package org.ssafy.respring.domain.book.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.ssafy.respring.domain.book.vo.BookContent;

import java.util.Optional;

public interface MongoBookContentRepository extends MongoRepository<BookContent, String> {
    BookContent findByBookId(Long bookId);
    void deleteByBookId(Long bookId);
}
