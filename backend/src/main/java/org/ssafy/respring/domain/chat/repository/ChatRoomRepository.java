package org.ssafy.respring.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.chat.vo.ChatRoom;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long>, ChatRoomRepositoryQuerydsl {
    Optional<ChatRoom> findByName(String name);
    List<ChatRoom> findByIsMentoring(boolean isMentoring);
}