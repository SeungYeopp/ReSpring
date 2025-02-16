package org.ssafy.respring.domain.notification.dto;

import lombok.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.ssafy.respring.domain.notification.vo.Notification;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSubscriptionDto {
    private Long id;
    private NotificationType type;
    private TargetType targetType;
    private Long targetId;
    private UUID initiatorId;           // receiver 정보
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationSubscriptionDto from(Notification notification, UUID initiatorId) {
        return NotificationSubscriptionDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .targetType(notification.getTargetType())
                .targetId(notification.getTargetId())
                .initiatorId(initiatorId)
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
