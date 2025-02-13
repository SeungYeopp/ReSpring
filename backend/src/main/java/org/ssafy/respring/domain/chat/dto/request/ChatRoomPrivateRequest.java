package org.ssafy.respring.domain.chat.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ChatRoomPrivateRequest {
    private Long roomId;
    private String name;
    private List<String> userIds;
    private boolean isOpenChat;
    private boolean isMentoring;
    private String mentorName;

    // ✅ 1:1 채팅용 필드 추가
    private String user1Name;
    private String user2Name;
}
