package org.ssafy.respring.domain.chat.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.chat.vo.ChatMessage;

import java.util.List;

@Repository
public interface MongoChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatRoomId(Long roomId);
    List<ChatMessage> findByContentContainingAndChatRoomId(String keyword, Long roomId);
}