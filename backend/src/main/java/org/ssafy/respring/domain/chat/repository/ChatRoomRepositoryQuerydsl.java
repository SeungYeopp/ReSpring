package org.ssafy.respring.domain.chat.repository;

import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepositoryQuerydsl {
    List<ChatRoom> findRoomsByUserId(UUID userId);

    Optional<ChatRoom> findExactPrivateRoom(User user1, User user2);
}
