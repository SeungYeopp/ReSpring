package org.ssafy.respring.domain.chat.repository;

import org.ssafy.respring.domain.chat.vo.ChatRoom;

import java.util.List;
import java.util.UUID;

public interface ChatRoomRepositoryQuerydsl {
    List<ChatRoom> findRoomsByUserId(UUID userId);
}
