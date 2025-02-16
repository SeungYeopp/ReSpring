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
    private NotificationType type;  // 좋아요, 구독, 댓글 등
    private TargetType targetType;  // 알림 (Post, Challenge, Book)
    private Long targetId;          // target의 Id
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}