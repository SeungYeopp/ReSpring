package org.ssafy.respring.domain.notification.dto;

import lombok.*;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDto {
    private Long id;
    private NotificationType type;
    private TargetType targetType;  // ✅ 추가
    private Long targetId; // ✅ 숫자 ID로 변경
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}