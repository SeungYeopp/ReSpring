package org.ssafy.respring.domain.event.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.event.dto.request.EventRequestDto;
import org.ssafy.respring.domain.event.dto.response.EventResponseDto;
import org.ssafy.respring.domain.event.repository.EventRepository;
import org.ssafy.respring.domain.event.vo.Event;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public Long createEvent(EventRequestDto requestDto, UUID userId) {

        Event event = new Event();
        event.setEventName(requestDto.getEventName());
        event.setCategory(requestDto.getCategory());
        event.setDisplay(requestDto.isDisplay());
        event.setOccurredAt(requestDto.getOccurredAt());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        event.setUser(user);

        eventRepository.save(event);
        return event.getId();
    }

    public void updateEvent(Long id, EventRequestDto requestDto, UUID userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        // 예외 처리)
        if (!event.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to update this event");
        }
        event.setEventName(requestDto.getEventName());
        event.setCategory(requestDto.getCategory());
        event.setDisplay(requestDto.isDisplay());
        event.setOccurredAt(requestDto.getOccurredAt());
    }

    public void deleteEvent(Long id, UUID userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        // 예외 처리)
        if (!event.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not allowed to delete this event");
        }
        eventRepository.deleteById(id);
    }

    public List<EventResponseDto> getMyEvents(UUID userId) {
        return eventRepository.getEventsSortedByOccurredAt(userId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public List<EventResponseDto> getTimelineByUserId(UUID userId) {
        return eventRepository.getTimelineByUserId(userId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    private EventResponseDto toResponseDto(Event event) {
        return new EventResponseDto(
                event.getId(),
                event.getEventName(),
                event.getOccurredAt(),
                event.isDisplay(),
                event.getCategory()
        );
    }
}
