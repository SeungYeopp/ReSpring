package org.ssafy.respring.domain.book.repository;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
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
                .where(bookLikes.likedAt.isNull().or(bookLikes.likedAt.after(oneWeekAgo))
                        .or(bookViews.updatedAt.isNull().or(bookViews.updatedAt.after(oneWeekAgo))))
                .groupBy(book.id)
                .orderBy(
                        bookLikes.count().coalesce(0L).desc(),  // 좋아요가 없으면 0으로 처리
                        bookViews.count().coalesce(0L).desc(),  // 조회수가 없으면 0으로 처리
                        book.createdAt.desc()  // 최신순 정렬
                )
                .limit(3)
                .fetch();
    }

    @Override
    public List<Book> getAllBooksSortedBy(String sortBy, boolean ascending, Long lastValue, LocalDateTime lastCreatedAt, Long lastId, int size) {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;
        QBookViews bookViews = QBookViews.bookViews;

        // 좋아요 및 조회수 집계
        NumberExpression<Long> likeCount = bookLikes.id.count().coalesce(0L);
        NumberExpression<Long> viewCount = bookViews.id.count().coalesce(0L);

        // ✅ 정렬 기준을 맞춰줌
        OrderSpecifier<?> primaryOrder;
        OrderSpecifier<?> secondaryOrder = ascending ? book.id.asc() : book.id.desc();

        switch (sortBy) {
            case "likes":
                primaryOrder = ascending ? likeCount.asc() : likeCount.desc();
                break;
            case "views":
                primaryOrder = ascending ? viewCount.asc() : viewCount.desc();
                break;
            default:
                primaryOrder = ascending ? book.createdAt.asc() : book.createdAt.desc();
                break;
        }

        // ✅ 커서 기반 페이징을 위한 조건 설정
        BooleanExpression cursorCondition = null;
        if (lastValue != null && lastId != null) {
            if (sortBy.equals("createdAt") && lastCreatedAt != null) {
                // ✅ createdAt 기준으로 정렬할 경우 LocalDateTime 비교
                cursorCondition = ascending
                        ? book.createdAt.gt(lastCreatedAt).or(book.createdAt.eq(lastCreatedAt).and(book.id.gt(lastId)))
                        : book.createdAt.lt(lastCreatedAt).or(book.createdAt.eq(lastCreatedAt).and(book.id.lt(lastId)));
            } else {
                // ✅ 좋아요 또는 조회수 기준으로 정렬할 경우
                NumberExpression<Long> sortExpression = sortBy.equals("likes") ? likeCount : viewCount;
                cursorCondition = ascending
                        ? sortExpression.gt(lastValue).or(sortExpression.eq(lastValue).and(book.id.gt(lastId)))
                        : sortExpression.lt(lastValue).or(sortExpression.eq(lastValue).and(book.id.lt(lastId)));
            }
        }

        return queryFactory
                .select(book)
                .from(book)
                .leftJoin(bookLikes).on(bookLikes.book.id.eq(book.id))
                .leftJoin(bookViews).on(bookViews.book.id.eq(book.id))
                .groupBy(book.id)
                .having(cursorCondition)  // ✅ `HAVING` 절로 변경
                .orderBy(primaryOrder, secondaryOrder)  // ✅ 정렬 기준 적용
                .limit(size)
                .fetch();
    }

    @Override
    public List<Book> getAllBooksSortedBy(String sortBy, boolean ascending) {
        QBook book = QBook.book;
        QBookLikes bookLikes = QBookLikes.bookLikes;
        QBookViews bookViews = QBookViews.bookViews;

        // 좋아요 및 조회수 집계
        NumberExpression<Long> likeCount = bookLikes.id.count().coalesce(0L);
        NumberExpression<Long> viewCount = bookViews.id.count().coalesce(0L);

        // 정렬 기준 설정
        OrderSpecifier<?> orderSpecifier;
        switch (sortBy) {
            case "likes":
                orderSpecifier = ascending ? likeCount.asc() : likeCount.desc();
                break;
            case "views":
                orderSpecifier = ascending ? viewCount.asc() : viewCount.desc();
                break;
            case "createdAt":
            default:
                orderSpecifier = ascending ? book.createdAt.asc() : book.createdAt.desc();
                break;
        }

        return queryFactory
                .select(book)
                .from(book)
                .leftJoin(bookLikes).on(bookLikes.book.id.eq(book.id))
                .leftJoin(bookViews).on(bookViews.book.id.eq(book.id))
                .groupBy(book.id)
                .orderBy(orderSpecifier, book.id.desc()) // ✅ ID 내림차순 추가 (중복 방지)
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
    public List<Book> getAllBooksSortedByTrends(Long lastLikes, Long lastViews, LocalDateTime lastCreatedAt, Long lastBookId, int size) {
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
                        lastCreatedAt == null ? null : book.createdAt.loe(lastCreatedAt), // 생성일 커서 적용
                        lastBookId == null ? null : book.id.lt(lastBookId) // ✅ 마지막 책 ID보다 작은 값만 조회 (중복 방지)
                )
                .orderBy(
                        likeCount.desc(),       // 1순위: 좋아요 수 내림차순
                        viewCount.desc(),       // 2순위: 조회수 내림차순
                        book.createdAt.desc(),  // 3순위: 최신순 정렬
                        book.id.desc()          // ✅ 4순위: 중복 방지를 위해 book ID 내림차순 추가
                )
                .limit(size)
                .fetch();
    }
}
