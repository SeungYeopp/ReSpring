package org.ssafy.respring.domain.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
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

    @GetMapping("/subscribe/{userId}")
    @Operation(summary = "SSE 구독", description = "사용자가 실시간 알림을 구독합니다.")
    public SseEmitter subscribe(@PathVariable UUID userId) {
        return sseService.subscribe(userId);
    }
}