package org.ssafy.respring.domain.book.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.book.vo.Book;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class BookRepositoryImpl implements BookRepositoryQueryDsl {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<Book> getLikedBooks(UUID userId) {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;

        return queryFactory.select(book)
                .from(bookLikes)
                .join(bookLikes.book, book)
                .where(bookLikes.user.id.eq(userId))
                .orderBy(bookLikes.createdAt.desc())
                .fetch();
    }

    @Override
    public List<Book> getMyBooks(UUID userId) {
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
                .where(bookLikes.createdAt.after(oneWeekAgo)
                        .or(bookViews.createdAt.after(oneWeekAgo)))
                .groupBy(book.id)
                .orderBy(
                        bookLikes.count().desc(),  // 1순위: 좋아요 수 내림차순
                        bookViews.count().desc(),  // 2순위: 조회수 내림차순
                        book.createdAt.desc()      // 3순위: 최신순 정렬
                )
                .limit(3)
                .fetch();
    }

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


}
