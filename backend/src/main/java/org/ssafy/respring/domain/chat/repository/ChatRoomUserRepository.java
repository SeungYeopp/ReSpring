package org.ssafy.respring.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.ChatRoomUser;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {
    Optional<ChatRoomUser> findByChatRoomAndUser(ChatRoom chatRoom, User user);
}
