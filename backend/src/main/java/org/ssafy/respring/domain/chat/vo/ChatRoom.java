package org.ssafy.respring.domain.chat.vo;

import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.user.vo.User;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "chat_room")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private boolean isOpenChat = false;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ChatRoomUser> chatRoomUsers = new ArrayList<>(); // ✅ 초기화 추가

    public List<User> getUsers() {
        return chatRoomUsers != null ? chatRoomUsers.stream().map(ChatRoomUser::getUser).collect(Collectors.toList()) : new ArrayList<>();
    }
}
