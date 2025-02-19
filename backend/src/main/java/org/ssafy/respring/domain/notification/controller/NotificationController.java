package org.ssafy.respring.domain.notification.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.ssafy.respring.domain.notification.dto.NotificationDto;
import org.ssafy.respring.domain.notification.service.NotificationService;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "알림 API", description = "SSE 방식의 실시간 알림 기능을 제공합니다.")
public class NotificationController {

    private final NotificationService notificationService;
    private final ConcurrentHashMap<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();

    @GetMapping("/{userId}")
    @Operation(summary = "전체 알림 조회", description = "사용자가 받은 알림을 조회합니다.")
    public ResponseEntity<List<NotificationDto>> getNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    // ✅ 특정 알림 읽음 처리
    @PatchMapping("/{notificationId}/read/{userId}")
    @Operation(summary = "특정 알림 읽음 처리", description = "특정 알림을 읽음 처리합니다.")
    public ResponseEntity<Void> markNotificationAsRead(
            @PathVariable Long notificationId,
            @PathVariable UUID userId
    ) {
        notificationService.markAsRead(notificationId, userId);
        return ResponseEntity.ok().build();
    }

    // ✅ 모든 알림 읽음 처리
    @PatchMapping("/read-all/{userId}")
    @Operation(summary = "모든 알림 읽음 처리", description = "모든 알림을 동시에 읽음 처리합니다.")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable UUID userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }




}
