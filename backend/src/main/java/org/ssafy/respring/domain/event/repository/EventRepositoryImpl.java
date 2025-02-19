package org.ssafy.respring.domain.event.repository;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.event.vo.QEvent;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class EventRepositoryImpl implements EventRepositoryQuerydsl {

    private final JPAQueryFactory queryFactory;

    QEvent event = new QEvent("e");

    @Override
    public List<Event> getTimelineByUserId(UUID userId) {
        return queryFactory.selectFrom(event)
          .where(event.user.id.eq(Expressions.constant(userId))
          .and(event.isDisplay.eq(true)))
          .orderBy(event.occurredAt.asc())
          .fetch();
    }

    @Override
    public List<Event> getEventsSortedByOccurredAt(UUID userId) {
        return queryFactory.selectFrom(event)
                .where(event.user.id.eq(Expressions.constant(userId)))
                .orderBy(event.occurredAt.asc()) // 오름차순 정렬 추가
                .fetch();
    }
}
