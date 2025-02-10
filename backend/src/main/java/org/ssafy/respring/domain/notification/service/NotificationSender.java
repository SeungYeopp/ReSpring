package org.ssafy.respring.domain.notification.service;

import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;

import java.util.UUID;

public interface NotificationSender {
    void sendNotification(UUID receiverId, NotificationType type, TargetType targetType, Long targetId, String message);
}
