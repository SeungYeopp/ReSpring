package org.ssafy.respring.domain.book.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.ssafy.respring.domain.book.vo.Book;

public interface BookRepository extends MongoRepository<Book, String> {
}
