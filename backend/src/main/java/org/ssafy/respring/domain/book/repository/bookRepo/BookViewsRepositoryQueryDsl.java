package org.ssafy.respring.domain.book.repository.bookRepo;

import org.ssafy.respring.domain.book.vo.BookViews;

import java.util.List;
import java.util.UUID;

public interface BookViewsRepositoryQueryDsl {
    List<BookViews> findTop10ByUserIdOrderByIdDesc(UUID userId); // 특정 사용자가 최근 조회한 책 10개 조회
}
