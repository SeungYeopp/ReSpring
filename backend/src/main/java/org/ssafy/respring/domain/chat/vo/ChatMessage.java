package org.ssafy.respring.domain.chat.vo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat_message") // MongoDB 컬렉션 지정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    private String id; // MongoDB의 ObjectId

    private String sender; // UUID 또는 닉네임 저장 가능
    private String receiver; // 1:1 채팅이면 UUID, 오픈채팅이면 null
    private String content;
    private String fileUrl; // 파일 또는 이미지 URL
    private boolean read;
    private LocalDateTime timestamp;

    private Long chatRoomId; // MySQL ChatRoom과 연결
}