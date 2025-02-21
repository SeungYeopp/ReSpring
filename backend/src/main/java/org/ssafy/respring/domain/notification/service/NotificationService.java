package org.ssafy.respring.domain.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.notification.dto.NotificationDto;
import org.ssafy.respring.domain.notification.dto.NotificationSubscriptionDto;
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
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SseService sseService;
    private final UserRepository userRepository;


    public void sendNotification(UUID receiverId, NotificationType type, TargetType targetType, Long targetId, String message) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자 정보를 찾을 수 없습니다."));

        Notification notification = Notification.builder()
                .receiver(receiver)
                .type(type)
                .targetType(targetType) //   대상 유형 추가
                .targetId(targetId) //   대상 ID
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        //   SSE를 통해 실시간으로 알림 전송
        sseService.sendNotification(receiverId, toDto(notification));
    }

    public void sendNotification(UUID receiverId, UUID initiatorId, NotificationType type, TargetType targetType, Long targetId, String message) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자 정보를 찾을 수 없습니다."));
        User initiator = userRepository.findById(initiatorId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 알림을 발생시킨 사용자를 찾을 수 없습니다."));

        Notification notification = Notification.builder()
                .receiver(receiver)
                .type(type)
                .targetType(targetType)
                .targetId(targetId) //   targetId 그대로 Long 사용
                .message(message)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        //   `initiatorId` 포함하여 DTO 변환 후 SSE 전송
        sseService.sendNotification(receiverId, NotificationSubscriptionDto.from(notification, initiator.getId()));
    }


    public List<NotificationDto> getNotifications(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        // 모든 알림 가져오기 (읽음 여부 상관 없음)
        List<Notification> notifications = notificationRepository.findByReceiver(user);

        return notifications.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }


    //   개별 알림 읽음 처리
    public void markAsRead(Long notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 알림을 찾을 수 없습니다. ID: " + notificationId));

        if (!notification.getReceiver().getId().equals(userId)) {
            throw new IllegalArgumentException("❌ 잘못된 접근입니다!");
        }

        if (!notification.isRead()) {
            notification.setRead(true);
            notificationRepository.save(notification);

            // ✅ SSE에 구독된 사용자에게만 알림 전송
            if (sseService.isUserSubscribed(userId)) {
                sseService.sendNotification(userId, toDto(notification));
            }
        }
    }


    //   모든 알림 읽음 처리
    public void markAllAsRead(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        List<Notification> notifications = notificationRepository.findByReceiverAndIsReadFalse(user);

        if (!notifications.isEmpty()) {
            for (Notification notification : notifications) {
                notification.setRead(true);
            }
            notificationRepository.saveAll(notifications);

            //   SSE를 통해 실시간 업데이트
            List<NotificationDto> notificationDtos = notifications.stream()
                    .map(this::toDto) //   sendNotification과 동일한 방식으로 DTO 변환
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