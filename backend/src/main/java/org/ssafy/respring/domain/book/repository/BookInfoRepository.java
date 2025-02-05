package org.ssafy.respring.domain.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.book.vo.BookInfo;

import java.util.Optional;

public interface BookInfoRepository extends JpaRepository<BookInfo, Long> {
    Optional<BookInfo> findByBookId(String bookId);
}
