package org.ssafy.respring.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.chat.vo.ChatMessage;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByChatRoomId(Long roomId);

    List<ChatMessage> findByContentContainingAndChatRoomId(String keyword, Long roomId);
}