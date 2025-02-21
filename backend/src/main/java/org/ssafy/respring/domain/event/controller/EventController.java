package org.ssafy.respring.domain.event.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.event.dto.request.EventRequestDto;
import org.ssafy.respring.domain.event.dto.response.EventResponseDto;
import org.ssafy.respring.domain.event.service.EventService;
import org.ssafy.respring.domain.user.service.UserService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Events API", description = "이벤트 및 타임라인 관련 API")
public class EventController {
    private final EventService eventService;
    private final UserService userService;

    @PostMapping
    @Operation(summary = "이벤트 생성", description = "새로운 이벤트를 생성합니다.")
    public ResponseEntity<Long> createEvent(@RequestBody EventRequestDto requestDto, HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(eventService.createEvent(requestDto, userId));
    }

    @PatchMapping("/{event_id}")
    @Operation(summary = "이벤트 수정", description = "특정 이벤트를 수정합니다.")
    public ResponseEntity<Void> updateEvent(
            @Parameter(description = "해당 이벤트 ID") @PathVariable Long event_id,
            @RequestBody EventRequestDto requestDto, HttpSession session) {

        UUID userId = (UUID) session.getAttribute("userId");

        eventService.updateEvent(event_id, requestDto, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{event_id}")
    @Operation(summary = "이벤트 삭제", description = "특정 이벤트를 삭제합니다.")
    public ResponseEntity<Void> deleteEvent(
            @Parameter(description = "해당 이벤트 ID") @PathVariable Long event_id,
            HttpSession session
    ) {
        UUID userId = (UUID) session.getAttribute("userId");
        eventService.deleteEvent(event_id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    @Operation(summary = "나의 이벤트 목록 조회", description = "나의 이벤트 목록을 조회합니다.")
    public ResponseEntity<List<EventResponseDto>> getMyEvents(
            HttpSession session
    ) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(eventService.getMyEvents(userId));
    }

    @GetMapping("/timeline/{nickname}")
    @Operation(summary = "타임라인 조회", description = "특정 사용자의 타임라인을 조회합니다.")
    public ResponseEntity<List<EventResponseDto>> getTimelineByUserId(
            @Parameter(description = "사용자 UUID") @PathVariable String nickname
    ) {
        UUID userId = userService.findByNickname(nickname).getId();
        return ResponseEntity.ok(eventService.getTimelineByUserId(userId));
    }
}