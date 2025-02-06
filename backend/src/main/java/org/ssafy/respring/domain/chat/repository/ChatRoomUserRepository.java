package org.ssafy.respring.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.ChatRoomUser;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomUserRepository extends JpaRepository<ChatRoomUser, Long> {
    Optional<ChatRoomUser> findByChatRoomAndUser(ChatRoom chatRoom, User user);
    boolean existsByChatRoom(ChatRoom chatRoom);

    @Modifying
    @Transactional
    @Query("DELETE FROM ChatRoomUser cru WHERE cru.chatRoom.id = :roomId AND cru.user.id = :userId")
    void deleteByRoomIdAndUserId(@Param("roomId") Long roomId, @Param("userId") UUID userId);
}
