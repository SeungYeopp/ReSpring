package org.ssafy.respring.domain.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.ssafy.respring.domain.book.vo.Book;

import java.util.List;
import java.util.UUID;

public interface  MongoBookRepository extends MongoRepository<Book, String> {
	List<Book> findByUserId(UUID userId);
}
