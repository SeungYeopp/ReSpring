package org.ssafy.respring.domain.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.event.vo.Event;

import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, Long>, EventRepositoryQuerydsl {
}