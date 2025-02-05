package org.ssafy.respring.domain.book.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.BookInfo;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookInfoRepository extends JpaRepository<BookInfo, Long> {
    Optional<BookInfo> findByBookId(String bookId);
	List<String> findLikedBookIdsByUser(UUID userId, List<String> bookIds);
}
