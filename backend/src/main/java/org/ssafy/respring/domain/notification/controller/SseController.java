package org.ssafy.respring.domain.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.ssafy.respring.domain.notification.service.SseService;

import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "SSE API")
public class SseController {
    private final SseService sseService;

    @GetMapping(value = "/subscribe", produces = "text/event-stream")
    @Operation(summary = "SSE 구독", description = "사용자가 실시간 알림을 구독합니다.")
    public ResponseEntity<SseEmitter> subscribe(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");

        if (userId == null) {
            SseEmitter emitter = new SseEmitter(0L);
            emitter.complete();
            return ResponseEntity.ok(emitter);
        }

        return ResponseEntity.ok(sseService.subscribe(userId));
    }
}