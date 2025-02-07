package org.ssafy.respring.domain.book.repository.chapterRepo;

import org.ssafy.respring.domain.book.vo.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long>, ChapterRepositoryQueryDsl {
    List<Chapter> findByBookId(Long bookId); // 특정 책의 챕터 리스트 조회
    void deleteByBookId(Long id);
}