package org.ssafy.respring.domain.notification.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.user.vo.User;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private NotificationType type; // ✅ 알림 타입 ('COMMENT', 'REPLY', 'LIKE', 'FOLLOW')

    @Enumerated(EnumType.STRING)
    private TargetType targetType; // ✅ 알림 대상 유형 (게시글, 챌린지, 사용자 등)

    private Long targetId; // ✅ Auto Increment된 숫자 ID

    private String message; // ✅ 알림 메시지
    private boolean isRead; // ✅ 읽음 여부

    @ManyToOne
    private User receiver; // ✅ 알림을 받을 유저

    private LocalDateTime createdAt;
}
