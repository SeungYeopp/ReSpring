package org.ssafy.respring.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.ssafy.respring.domain.notification.dto.NotificationDto;
import org.ssafy.respring.domain.notification.repository.NotificationRepository;
import org.ssafy.respring.domain.notification.vo.Notification;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService implements NotificationSender{
    private final NotificationRepository notificationRepository;
    private final SseService sseService; // ✅ SSE 서비스 전담
    private final UserRepository userRepository;


    @Override
    public void sendNotification(UUID receiverId, NotificationType type, TargetType targetType, Long targetId, String message) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자 정보를 찾을 수 없습니다."));

        Notification notification = Notification.builder()
                .receiver(receiver)
                .type(type)
                .targetType(targetType) // ✅ 대상 유형 추가
                .targetId(targetId) // ✅ 대상 ID
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // ✅ SSE를 통해 실시간으로 알림 전송
        sseService.sendNotification(receiverId, toDto(notification));
    }

    public List<NotificationDto> getUnreadNotifications(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByReceiverAndIsReadFalse(user);

        return notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ✅ 개별 알림 읽음 처리
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 알림을 찾을 수 없습니다. ID: " + notificationId));

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);

            // ✅ SSE로 프론트에 업데이트
            sseService.sendNotification(notification.getReceiver().getId(),
                    NotificationDto.builder()
                            .id(notification.getId())
                            .message(notification.getMessage())
                            .isRead(true)
                            .createdAt(notification.getCreatedAt())
                            .build()
            );
        }
    }

    // ✅ 모든 알림 읽음 처리
    public void markAllAsRead(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByReceiverAndIsReadFalse(user);

        if (!notifications.isEmpty()) {
            for (Notification notification : notifications) {
                notification.setRead(true);
            }
            notificationRepository.saveAll(notifications);

            // ✅ SSE를 통해 실시간 업데이트
            List<NotificationDto> notificationDtos = notifications.stream()
                    .map(this::toDto) // ✅ sendNotification과 동일한 방식으로 DTO 변환
                    .collect(Collectors.toList());

            for (NotificationDto notificationDto : notificationDtos) {
                sseService.sendNotification(userId, notificationDto);
            }

        }
    }



    private NotificationDto toDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .targetType(notification.getTargetType())
                .targetId(notification.getTargetId())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}