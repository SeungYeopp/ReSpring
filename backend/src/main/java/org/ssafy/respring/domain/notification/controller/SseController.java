package org.ssafy.respring.domain.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.ssafy.respring.domain.notification.service.SseService;

import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "SSE API")
public class SseController {
    private final SseService sseService;

    @GetMapping(value = "/subscribe/{userId}", produces = "text/event-stream")
    @Operation(summary = "SSE 구독", description = "사용자가 실시간 알림을 구독합니다.")
    public ResponseEntity<SseEmitter> subscribe(@PathVariable UUID userId) {
        if (userId == null) {
            SseEmitter emitter = new SseEmitter(0L);
            emitter.complete();
            return ResponseEntity.ok(emitter);
        }
        return ResponseEntity.ok(sseService.subscribe(userId));
    }
}