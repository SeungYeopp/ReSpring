package org.ssafy.respring.domain.chat.dto.request;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class ChatRoomRequest {
    private String name;
    private List<String> userIds;
    private boolean isOpenChat;
}
