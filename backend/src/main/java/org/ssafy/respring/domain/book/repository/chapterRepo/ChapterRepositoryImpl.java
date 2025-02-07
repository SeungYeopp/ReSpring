package org.ssafy.respring.domain.book.repository.chapterRepo;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.ssafy.respring.domain.book.vo.Chapter;
import org.ssafy.respring.domain.book.vo.QChapter;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.comment.vo.QComment;

import java.util.List;

@RequiredArgsConstructor
public class ChapterRepositoryImpl implements ChapterRepositoryQueryDsl {

	private final JPAQueryFactory queryFactory;

	@Override
	public List<Chapter> findByBookIdOrderByOrderAsc(Long bookId) {
		QChapter chapter = QChapter.chapter;

		return queryFactory
		  .selectFrom(chapter)
		  .where(chapter.bookId.eq(bookId))
		  .orderBy(chapter.chapterOrder.asc()) // ✅ 추가: 순서 기준 정렬
		  .fetch();
	}
}
