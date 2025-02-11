package org.ssafy.respring.domain.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.ssafy.respring.domain.notification.dto.NotificationDto;
import org.ssafy.respring.domain.notification.service.NotificationService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "알림 API", description = "SSE 방식의 실시간 알림 기능을 제공합니다.")
public class NotificationController {

    private final NotificationService notificationService;
    private final ConcurrentHashMap<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();



    @GetMapping(value = "/subscribe/{userId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @Operation(summary = "알림 구독 (SSE)", description = "SSE를 이용해 실시간으로 알림을 받습니다. 클라이언트는 이 엔드포인트에 지속적으로 연결해야 합니다.")
    public SseEmitter subscribe(
            @PathVariable
            @Parameter(description = "사용자 UUID", example = "dd5a7b3c-d887-11ef-b310-d4f32d147183", schema = @Schema(type = "string", format = "uuid"))
            UUID userId) {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));

        try {
            emitter.send(SseEmitter.event().name("connect").data("SSE 연결됨"));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }



    @GetMapping("/{userId}")
    @Operation(summary = "읽지 않은 알림 조회", description = "사용자가 아직 읽지 않은 알림을 조회합니다.")
    public ResponseEntity<List<NotificationDto>> getUnreadNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    public void sendNotification(Long userId, NotificationDto notificationDto) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data(notificationDto));
            } catch (IOException e) {
                emitters.remove(userId);
            }
        }
    }

    // ✅ 특정 알림 읽음 처리
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    // ✅ 모든 알림 읽음 처리
    @PatchMapping("/read-all/{userId}")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable UUID userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }




}
