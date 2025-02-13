package org.ssafy.respring.domain.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.ssafy.respring.domain.notification.service.SseService;

import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class SseController {
    private final SseService sseService;

    private UUID requireLogin(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        if (userId == null) {
            throw new IllegalArgumentException("❌ 로그인이 필요합니다.");
        }
        return userId;
    }

    @GetMapping(value = "/subscribe", produces = "text/event-stream")
    @Operation(summary = "SSE 구독", description = "사용자가 실시간 알림을 구독합니다.")
    public SseEmitter subscribe(HttpSession session) {
        UUID userId = requireLogin(session);
        return sseService.subscribe(userId);
    }
}