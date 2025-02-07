package org.ssafy.respring.domain.book.repository.chapterRepo;

import org.ssafy.respring.domain.book.vo.Chapter;

import java.util.List;

public interface ChapterRepositoryQueryDsl {
    List<Chapter> findByBookIdOrderByOrderAsc(Long bookId);
}
