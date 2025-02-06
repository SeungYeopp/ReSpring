package org.ssafy.respring.domain.book.repository;

import org.ssafy.respring.domain.book.vo.BookViews;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BookViewsRepository extends JpaRepository<BookViews, Long> {
    boolean existsByBookIdAndUserId(Long bookId, UUID userId); // 특정 사용자가 책을 조회했는지 여부 확인
    List<BookViews> findTop10ByUserIdOrderByIdDesc(UUID userId); // 특정 사용자가 최근 조회한 책 10개 조회
}
