package org.ssafy.respring.domain.chat.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "chat_message")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;

    private String receiver; // Null이면 오픈채팅 메시지

    private String content;

    private String fileUrl; // 파일 또는 이미지 URL

    @Column(name = "`read`", nullable = false) // MySQL 예약어와 충돌 방지
    private boolean read;

    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}