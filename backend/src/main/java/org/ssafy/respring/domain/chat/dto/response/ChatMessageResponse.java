package org.ssafy.respring.domain.chat.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private String sender;
    private String receiver;
    private String content;
    private String fileUrl;
    private boolean read;
    private LocalDateTime timestamp;
}
