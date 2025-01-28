package org.ssafy.respring.domain.chat.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.chat.dto.request.ChatMessageRequest;
import org.ssafy.respring.domain.chat.dto.request.ChatRoomRequest;
import org.ssafy.respring.domain.chat.dto.response.ChatMessageResponse;
import org.ssafy.respring.domain.chat.dto.response.ChatRoomResponse;
import org.ssafy.respring.domain.chat.service.ChatService;
import org.ssafy.respring.domain.chat.vo.ChatMessage;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.user.vo.User;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageRequest messageRequest) {
        ChatMessageResponse response = chatService.saveMessage(
                messageRequest.getRoomId(),
                messageRequest.getUserId(),
                messageRequest.getReceiver(),
                messageRequest.getContent()
        );

        // 1:1 채팅인 경우
        if (messageRequest.getReceiver() != null) {
            // 송신자와 수신자에게만 메시지 전달
            messagingTemplate.convertAndSendToUser(
                    messageRequest.getUserId().toString(),
                    "/queue/private-messages",
                    response
            );
            messagingTemplate.convertAndSendToUser(
                    messageRequest.getReceiver(),
                    "/queue/private-messages",
                    response
            );
        } else {
            // 오픈 채팅방의 경우 모든 클라이언트에 메시지 브로드캐스트
            messagingTemplate.convertAndSend(
                    "/topic/messages/" + messageRequest.getRoomId(),
                    response
            );
        }
    }

    @Operation(summary = "채팅방 리스트 조회", description = "현재 존재하는 모든 채팅방의 리스트를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅방 리스트 조회 성공",
                    content = @Content(schema = @Schema(implementation = ChatRoomResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @GetMapping("/chat/rooms")
    @ResponseBody
    public List<ChatRoomResponse> getAllRooms() {
        List<ChatRoom> chatRooms = chatService.getAllRooms();
        return chatRooms.stream()
                .map(chatRoom -> ChatRoomResponse.builder()
                        .roomId(chatRoom.getId())
                        .name(chatRoom.getName())
                        .build())
                .collect(Collectors.toList());
    }




    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅방 생성 성공",
                    content = @Content(schema = @Schema(implementation = ChatRoomResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @PostMapping("/chat/room")
    @ResponseBody
    public ChatRoomResponse createRoomWithParams(
            @RequestParam String name,
            @RequestParam List<String> userIds) {

        System.out.println("Received Room Name: " + name);
        System.out.println("Received User IDs: " + userIds);

        if (userIds == null || userIds.isEmpty()) {
            throw new IllegalArgumentException("유효한 유저 ID 리스트를 제공해야 합니다.");
        }

        ChatRoom chatRoom = chatService.createRoom(name, userIds);
        return ChatRoomResponse.builder()
                .roomId(chatRoom.getId())
                .name(chatRoom.getName())
                .build();
    }

    @PostMapping("/room/join")
    public ChatRoomResponse joinRoom(@RequestParam Long roomId, @RequestParam UUID userId) {
        ChatRoom chatRoom = chatService.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다: " + roomId));

        // 사용자가 이미 참여한 경우 추가하지 않음
        boolean alreadyJoined = chatRoom.getUsers().stream()
                .anyMatch(user -> user.getId().equals(userId));

        if (!alreadyJoined) {
            User user = new User();
            user.setId(userId);

            chatRoom.getUsers().add(user);
            chatService.saveChatRoom(chatRoom); // 변경 사항 저장
        }

        return new ChatRoomResponse(chatRoom.getId(), chatRoom.getName());
    }


    @Operation(summary = "파일 업로드", description = "채팅 메시지에 파일을 업로드합니다.")
    @PostMapping("/chat/upload")
    @ResponseBody
    public ChatMessage uploadFile(
            @RequestParam Long roomId,
            @RequestParam UUID userId,
            @RequestParam MultipartFile file) throws IOException {
        return chatService.saveFileMessage(roomId, userId, file);
    }

    @Operation(summary = "메시지 삭제", description = "특정 메시지를 삭제합니다.")
    @DeleteMapping("/chat/message/{messageId}")
    @ResponseBody
    public void deleteMessage(@PathVariable Long messageId, @RequestParam UUID userId) {
        chatService.deleteMessage(messageId, userId);
    }

    @Operation(summary = "메시지 읽음 처리", description = "특정 메시지를 읽음 처리합니다.")
    @PostMapping("/chat/message/{messageId}/read")
    @ResponseBody
    public void markMessageAsRead(@PathVariable Long messageId) {
        chatService.markMessageAsRead(messageId);
    }

    @Operation(summary = "메시지 검색", description = "키워드를 사용하여 채팅 메시지를 검색합니다.")
    @GetMapping("/chat/messages/{roomId}/search")
    @ResponseBody
    public List<ChatMessage> searchMessages(@PathVariable Long roomId, @RequestParam String keyword) {
        return chatService.searchMessages(roomId, keyword);
    }

    @Operation(summary = "채팅 메시지 조회", description = "특정 채팅방의 모든 메시지를 조회합니다.")
    @GetMapping("/chat/messages/{roomId}")
    @ResponseBody
    public List<ChatMessageResponse> getMessages(@PathVariable Long roomId) {
        return chatService.getMessages(roomId).stream()
                .map(message -> ChatMessageResponse.builder()
                        .sender(message.getSender())
                        .receiver(message.getReceiver())
                        .content(message.getContent())
                        .fileUrl(message.getFileUrl())
                        .read(message.isRead())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    @Operation(summary = "방 이름으로 Room ID 조회", description = "특정 방 이름에 해당하는 Room ID를 반환합니다.")
    @GetMapping("/chat/room/findByName")
    @ResponseBody
    public Long getRoomIdByName(@RequestParam String name) {
        ChatRoom chatRoom = chatService.findRoomByName(name);
        if (chatRoom == null) {
            throw new IllegalArgumentException("해당 이름의 방이 존재하지 않습니다: " + name);
        }
        return chatRoom.getId();
    }

}

