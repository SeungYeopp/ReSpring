package org.ssafy.respring.domain.book.repository.info;

import org.ssafy.respring.domain.book.vo.BookViews;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookViewsRepository extends JpaRepository<BookViews, Long>, BookViewsRepositoryQueryDsl {
    boolean existsByBookIdAndUserId(Long bookId, UUID userId); // 특정 사용자가 책을 조회했는지 여부 확인
}
