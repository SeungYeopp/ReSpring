package org.ssafy.respring.domain.chat.vo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "chatroom_user")
@IdClass(ChatroomUserId.class)
public class ChatroomUser {
    @Id
    private Long roomId;

    @Id
    private Long challengeId;

    @Id
    private byte[] userId;
}
