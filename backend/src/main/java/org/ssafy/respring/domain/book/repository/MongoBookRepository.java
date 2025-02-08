package org.ssafy.respring.domain.book.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.ssafy.respring.domain.book.vo.Book;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface  MongoBookRepository extends MongoRepository<Book, String> {
	List<Book> findAll(Sort sort);
	List<Book> findByUserId(UUID userId);
	List<Book> findTop3ByCreatedAtAfter(LocalDateTime oneWeekAgo, Pageable pageable);
}
