package org.ssafy.respring.domain.chat.dto.request;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest {
    private Long roomId;
    private String receiver;
    private String content;
}
