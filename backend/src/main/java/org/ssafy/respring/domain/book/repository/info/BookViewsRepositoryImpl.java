package org.ssafy.respring.domain.book.repository.info;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.book.vo.BookViews;
import org.ssafy.respring.domain.book.vo.QBookViews;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class BookViewsRepositoryImpl implements BookViewsRepositoryQueryDsl {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<BookViews> findTop10ByUserIdOrderByIdDesc(UUID userId) {
        QBookViews bookViews = QBookViews.bookViews;

        return queryFactory
                .selectFrom(bookViews)
                .where(bookViews.user.id.eq(userId))
                .orderBy(bookViews.id.desc())  // ✅ ID를 기준으로 내림차순 정렬 (최근 조회한 책이 위로)
                .limit(10)  // ✅ 최근 10개 조회
                .fetch();
    }
}
