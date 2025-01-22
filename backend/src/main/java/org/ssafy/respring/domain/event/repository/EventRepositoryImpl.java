package org.ssafy.respring.domain.event.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.event.vo.QEvent;

import java.util.List;
import java.util.UUID;

@Repository
public class EventRepositoryImpl implements EventRepositoryQuerydsl {
    private final JPAQueryFactory jpaQueryFactory;

    public EventRepositoryImpl(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }

    QEvent event = new QEvent("e");

    @Override
    public List<Event> findMyAllEvents(UUID userId) {
        return List.of();
    }

    @Override
    public List<Event> findEventsByUserId(UUID userId) {
        return List.of();
    }
}
