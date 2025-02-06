package org.ssafy.respring.domain.book.repository;

import org.ssafy.respring.domain.book.vo.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, Long>, BookRepositoryQueryDsl {
    Optional<Book> findById(Long id);
    List<Book> findByAuthorId(UUID authorId); // 특정 사용자의 책 목록 조회
    boolean existsById(Long id);
}
