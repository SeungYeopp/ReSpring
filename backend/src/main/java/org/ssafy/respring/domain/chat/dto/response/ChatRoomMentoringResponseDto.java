package org.ssafy.respring.domain.chat.dto.response;

import lombok.*;
import org.ssafy.respring.domain.chat.vo.ChatRoom;

import java.util.List;
import java.util.UUID;

@Builder
@Getter
public class ChatRoomMentoringResponseDto {
    private Long roomId;
    private String name;
    private boolean isMentoring;
    private String mentorName;
    private int userCount;
    private List<String> participants; // ✅ 참가자 목록 추가
}


