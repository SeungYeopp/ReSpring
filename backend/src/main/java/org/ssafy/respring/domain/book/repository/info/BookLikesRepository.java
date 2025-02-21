package org.ssafy.respring.domain.book.repository.info;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.BookLikes;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Optional;
import java.util.UUID;

public interface BookLikesRepository extends JpaRepository<BookLikes, Long> {
    Optional<BookLikes> findByBookIdAndUserId(Long bookId, UUID userId); // 특정 사용자의 특정 책 좋아요 여부 확인

    void deleteByBookIdAndUserId(Long bookId, UUID userId); // 좋아요 취소

    boolean existsByBookAndUser(Book book, User user);
}
