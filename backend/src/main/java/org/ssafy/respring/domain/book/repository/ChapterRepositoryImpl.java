package org.ssafy.respring.domain.book.repository;

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

	@Override
	public List<Comment> findCommentsByBookId(Long bookId) {
		QComment comment = QComment.comment; // QueryDSL 엔티티

		return queryFactory
		  .selectFrom(comment)
		  .where(comment.book.id.eq(bookId)) // 특정 bookId의 댓글만 조회
		  .orderBy(comment.createdAt.desc()) // 최신 댓글 순 정렬
		  .fetch();
	}
}
