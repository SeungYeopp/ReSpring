package org.ssafy.respring.domain.chat.dto.response;

import lombok.*;
import org.ssafy.respring.domain.chat.vo.ChatRoom;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomResponse {
    private Long roomId;
    private String name;
    private Boolean isOpenChat;
    private int userCount;

    // ✅ ChatRoom -> ChatRoomResponse 변환 메서드 추가
    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
                .roomId(chatRoom.getId())
                .name(chatRoom.getName())
                .isOpenChat(chatRoom.isOpenChat())
                .userCount(chatRoom.getUsers().size())
                .build();
    }
}
