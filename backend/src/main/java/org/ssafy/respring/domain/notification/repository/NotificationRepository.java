package org.ssafy.respring.domain.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.notification.vo.Notification;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverAndIsReadFalse(User receiver);

    List<Notification> findByReceiver(User receiver);
}
