package org.ssafy.respring.domain.chat.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.user.vo.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "chat_room_users")
public class ChatRoomUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private boolean isActive; //   사용자 활성 상태 추가
}
