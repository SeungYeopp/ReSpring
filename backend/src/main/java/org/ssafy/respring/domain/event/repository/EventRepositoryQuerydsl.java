package org.ssafy.respring.domain.event.repository;

import org.ssafy.respring.domain.event.vo.Event;

import java.util.List;
import java.util.UUID;

public interface EventRepositoryQuerydsl {
    List<Event> getTimelineByUserId(UUID userId);
}
