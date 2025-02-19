package org.ssafy.respring.domain.chat.dto.request;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatRoomRequest {
    private Long roomId;
    private String name;
    private List<String> userIds;
    private boolean isOpenChat;
}
