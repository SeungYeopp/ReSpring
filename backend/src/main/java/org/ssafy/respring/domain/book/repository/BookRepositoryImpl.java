package org.ssafy.respring.domain.book.repository;

import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.QBook;
import org.ssafy.respring.domain.book.vo.QBookLikes;
import org.ssafy.respring.domain.book.vo.QBookViews;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class BookRepositoryImpl implements BookRepositoryQueryDsl {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Book> findLikedBooksByUserId(UUID userId) {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;

        return queryFactory.select(book)
                .from(bookLikes)
                .join(bookLikes.book, book)
                .where(bookLikes.user.id.eq(userId))
                .orderBy(bookLikes.likedAt.desc())
                .fetch();
    }

    @Override
    public List<Book> findMyBooksByUserId(UUID userId) {
        QBook book = QBook.book;

        return queryFactory.selectFrom(book)
                .where(book.author.id.eq(userId))
                .orderBy(book.createdAt.desc()) // 최신 순 정렬
                .fetch();
    }

    @Override
    public List<Book> getWeeklyTop3Books() {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;
        QBookViews bookViews = QBookViews.bookViews;

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);

        return queryFactory.select(book)
                .from(book)
                .leftJoin(bookLikes).on(bookLikes.book.id.eq(book.id))
                .leftJoin(bookViews).on(bookViews.book.id.eq(book.id))
                .where(bookLikes.likedAt.after(oneWeekAgo)
                        .or(bookViews.updatedAt.after(oneWeekAgo)))
                .groupBy(book.id)
                .orderBy(
                        bookLikes.count().desc(),  // 1순위: 좋아요 수 내림차순
                        bookViews.count().desc(),  // 2순위: 조회수 내림차순
                        book.createdAt.desc()      // 3순위: 최신순 정렬W
                )
                .limit(3)
                .fetch();
    }

    // 무한 스크롤 적용 x
    @Override
    public List<Book> getAllBooksSortedByTrends() {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;
        QBookViews bookViews = QBookViews.bookViews;

        return queryFactory.select(book)
                .from(book)
                .leftJoin(bookLikes).on(bookLikes.book.id.eq(book.id))
                .leftJoin(bookViews).on(bookViews.book.id.eq(book.id))
                .groupBy(book.id)
                .orderBy(
                        bookLikes.count().desc(),  // 1순위: 좋아요 수 내림차순
                        bookViews.count().desc(),  // 2순위: 조회수 내림차순
                        book.createdAt.desc()      // 3순위: 최신순 정렬
                )
                .fetch();
    }

    @Override
    public List<Book> getAllBooksSortedByTrends(Long lastLikes, Long lastViews, LocalDateTime lastCreatedAt, int size) {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;
        QBookViews bookViews = QBookViews.bookViews;

        // COALESCE 적용 (좋아요 또는 조회수가 없으면 0으로 처리)
        NumberExpression<Long> likeCount = bookLikes.id.count().coalesce(0L);
        NumberExpression<Long> viewCount = bookViews.id.count().coalesce(0L);

        return queryFactory
                .select(book)
                .from(book)
                .leftJoin(bookLikes).on(bookLikes.book.id.eq(book.id))
                .leftJoin(bookViews).on(bookViews.book.id.eq(book.id))
                .groupBy(book.id)
                .having(
                        lastLikes == null ? null : likeCount.loe(lastLikes),  // 좋아요 수 이하 필터링
                        lastViews == null ? null : viewCount.loe(lastViews)   // 조회수 이하 필터링
                )
                .where(
                        lastCreatedAt == null ? null : book.createdAt.loe(lastCreatedAt) // 생성일 커서 적용
                )
                .orderBy(
                        likeCount.desc(),   // 1순위: 좋아요 수 내림차순
                        viewCount.desc(),   // 2순위: 조회수 내림차순
                        book.createdAt.desc()  // 3순위: 최신순 정렬
                )
                .limit(size)
                .fetch();
    }
}
