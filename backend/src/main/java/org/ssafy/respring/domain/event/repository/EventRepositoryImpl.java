package org.ssafy.respring.domain.event.repository;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.event.vo.QEvent;

import java.util.List;
import java.util.UUID;

@Repository
public class EventRepositoryImpl implements EventRepositoryQuerydsl {
    private final JPAQueryFactory queryFactory;
    public EventRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    QEvent event = new QEvent("e");

    @Override
    public List<Event> getTimelineByUserId(UUID userId) {
        return queryFactory.selectFrom(event)
          .where(event.userId.eq(Expressions.constant(userId)))
          .fetch();
    }
}
