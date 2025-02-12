package org.ssafy.respring.domain.chat.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.chat.dto.request.ChatMessageRequest;
import org.ssafy.respring.domain.chat.dto.request.ChatRoomPrivateRequest;
import org.ssafy.respring.domain.chat.dto.request.ChatRoomRequest;
import org.ssafy.respring.domain.chat.dto.response.ChatMessageResponse;
import org.ssafy.respring.domain.chat.dto.response.ChatRoomMentoringResponseDto;
import org.ssafy.respring.domain.chat.dto.response.ChatRoomResponse;
import org.ssafy.respring.domain.chat.repository.MongoChatMessageRepository;
import org.ssafy.respring.domain.chat.service.ChatService;
import org.ssafy.respring.domain.chat.vo.ChatMessage;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;
    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final MongoChatMessageRepository chatMessageRepository;

    private static final String LAST_SEEN_PREFIX = "last_seen:";

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessageRequest messageRequest) {
        ChatMessageResponse response = chatService.saveMessage(
                messageRequest.getRoomId(),
                messageRequest.getUserId(),
                messageRequest.getReceiver(),
                messageRequest.getContent()
        );

        messagingTemplate.convertAndSend(
                "/topic/messages/" + messageRequest.getRoomId(),
                response
        );

    }

    /** ✅ 모든 채팅방 조회 (WebSocket) */
    @MessageMapping("/chat/rooms")
    @SendTo("/topic/chat/rooms")
    public List<ChatRoomResponse> getAllRooms() {
        return chatService.getAllRooms().stream()
                .map(chatRoom -> ChatRoomResponse.builder()
                        .roomId(chatRoom.getId())
                        .name(chatRoom.getName())
                        .isOpenChat(chatRoom.isOpenChat())
                        .mentorId(chatRoom.getMentorId())
                        .isMentoring(chatRoom.isMentoring())
                        .userCount(chatRoom.getUsers().size())
                        .build())
                .collect(Collectors.toList());
    }

    /** ✅ 내 채팅방 조회 (WebSocket) */
    @MessageMapping("/chat/myRooms/{userId}")
    @SendTo("/topic/chat/myRooms/{userId}")
    public List<ChatRoomResponse> getMyRooms(@DestinationVariable UUID userId) {
        return chatService.getUserRooms(userId).stream()
                .map(chatRoom -> ChatRoomResponse.builder()
                        .roomId(chatRoom.getId())
                        .name(chatRoom.getName())
                        .isOpenChat(chatRoom.isOpenChat())
                        .isMentoring(chatRoom.isMentoring())
                        .mentorId(chatRoom.getMentorId())
                        .userCount(chatRoom.getUsers().size())
                        .build())
                .collect(Collectors.toList());
    }

    /** ✅ 멘토링 채팅방 조회 (WebSocket) */
    @MessageMapping("/chat/mentoringRooms")
    @SendTo("/topic/chat/mentoringRooms")
    public List<ChatRoomMentoringResponseDto> getMentoringRooms() {
        return chatService.getMentoringRooms().stream()
                .map(room -> ChatRoomMentoringResponseDto.builder()
                        .roomId(room.getId())
                        .name(room.getName())
                        .isMentoring(true)
                        .mentorId(room.getMentorId())
                        .userCount(room.getUsers().size())
                        .participants(room.getUsers().stream().map(User::getId).collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    /** ✅ 방 참가 기능 */
    @MessageMapping("/chat/joinRoom")
    public void joinRoom(ChatRoomRequest request) {
        UUID userId = UUID.fromString(request.getUserIds().get(0));
        chatService.joinRoom(request.getRoomId(), userId);

        // 참가한 사용자에게 업데이트된 방 정보를 전송
        messagingTemplate.convertAndSend("/topic/chat/myRooms/" + userId, getMyRooms(userId));
    }




    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅방 생성 성공",
                    content = @Content(schema = @Schema(implementation = ChatRoomResponse.class))),
            @ApiResponse(responseCode = "400", description = "잘못된 요청")
    })
    @MessageMapping("/chat.createRoom")
    @SendTo("/topic/rooms")
    public ChatRoomResponse createRoom(ChatRoomRequest request) {
        ChatRoom chatRoom = chatService.createRoom(request);
        return ChatRoomResponse.builder()
                .roomId(chatRoom.getId())
                .name(chatRoom.getName())
                .isOpenChat(chatRoom.isOpenChat())
                .isMentoring(chatRoom.isMentoring())
                .mentorId(chatRoom.getMentorId())
                .userCount(chatRoom.getUsers().size())
                .build();
    }




//    @Operation(summary = "파일 업로드", description = "채팅 메시지에 파일을 업로드합니다.")
//    @PostMapping("/chat/upload")
//    @ResponseBody
//    public ChatMessage uploadFile(
//            @RequestParam Long roomId,
//            @RequestParam UUID userId,
//            @RequestParam MultipartFile file) throws IOException {
//        return chatService.saveFileMessage(roomId, userId, file);
//    }

//    @Operation(summary = "메시지 삭제", description = "특정 메시지를 삭제합니다.")
//    @DeleteMapping("/chat/message/{messageId}")
//    @ResponseBody
//    public void deleteMessage(@PathVariable String messageId, @RequestParam UUID userId) {
//        chatService.deleteMessage(messageId, userId);
//    }
//
//    @Operation(summary = "메시지 읽음 처리", description = "특정 메시지를 읽음 처리합니다.")
//    @PostMapping("/chat/message/{messageId}/read")
//    @ResponseBody
//    public void markMessageAsRead(@PathVariable String messageId) {
//        chatService.markMessageAsRead(messageId);
//    }
//
//    @Operation(summary = "메시지 검색", description = "키워드를 사용하여 채팅 메시지를 검색합니다.")
//    @GetMapping("/chat/messages/{roomId}/search")
//    @ResponseBody
//    public List<ChatMessage> searchMessages(@PathVariable Long roomId, @RequestParam String keyword) {
//        return chatService.searchMessages(roomId, keyword);
//    }

    @Operation(summary = "채팅 메시지 조회", description = "특정 채팅방의 모든 메시지를 조회합니다.")
    @GetMapping("/chat/messages/{roomId}")  // ✅ REST API로 변경
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable Long roomId) {
        List<ChatMessageResponse> messages = chatService.getMessages(roomId).stream()
                .map(message -> ChatMessageResponse.builder()
                        .sender(message.getSender())
                        .receiver(message.getReceiver())
                        .content(message.getContent())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(messages);
    }




//    @Operation(summary = "방 이름으로 Room ID 조회", description = "특정 방 이름에 해당하는 Room ID를 반환합니다.")
//    @GetMapping("/chat/room/findByName")
//    @ResponseBody
//    public Long getRoomIdByName(@RequestParam String name) {
//        ChatRoom chatRoom = chatService.findRoomByName(name);
//        if (chatRoom == null) {
//            throw new IllegalArgumentException("해당 이름의 방이 존재하지 않습니다: " + name);
//        }
//        return chatRoom.getId();
//    }



    @Operation(summary = "채팅방 나가기", description = "사용자가 채팅방을 나갑니다.")
    @MessageMapping("/chat.leaveRoom")
    public void leaveRoom(ChatRoomRequest request) {
        chatService.leaveRoom(request.getRoomId(), UUID.fromString(request.getUserIds().get(0)));
    }


    @MessageMapping("/chat.private")
    public void getOrJoinPrivateRoom(ChatRoomPrivateRequest request) {
        if (request.getUser1() == null || request.getUser2() == null) {
            throw new IllegalArgumentException("Both user1 and user2 must be provided for private chat.");
        }

        ChatRoom chatRoom = chatService.getOrJoinPrivateRoom(
                request.getUser1(),
                request.getUser2()
        );

        ChatRoomResponse response = ChatRoomResponse.from(chatRoom);

        // ✅ WebSocket을 통해 두 사용자에게 새로운 1:1 채팅방 정보 전송
        messagingTemplate.convertAndSend("/topic/newRoom/" + request.getUser1(), response);
        messagingTemplate.convertAndSend("/topic/newRoom/" + request.getUser2(), response);
    }





    // ✅ 멘토링(강연자) 방 생성
    @PostMapping("/chat/room/mentoring")
    @ResponseBody
    public ChatRoomMentoringResponseDto createMentoringRoom(
            @RequestParam String name,
            @RequestParam UUID mentorId) {

        ChatRoom chatRoom = chatService.createMentoringRoom(name, mentorId);

        return ChatRoomMentoringResponseDto.builder()
                .roomId(chatRoom.getId())
                .name(chatRoom.getName())
                .isMentoring(true)
                .mentorId(mentorId)
                .userCount(chatRoom.getUsers().size())
                .build();
    }

    @MessageMapping("/chat.getRoomInfo/{roomId}")
    @SendTo("/topic/chat/roomInfo/{roomId}")
    public ChatRoomMentoringResponseDto getRoomInfo(@DestinationVariable Long roomId) {
        ChatRoom chatRoom = chatService.getRoomById(roomId);
        return ChatRoomMentoringResponseDto.builder()
                .roomId(chatRoom.getId())
                .name(chatRoom.getName())
                .isMentoring(chatRoom.isMentoring())
                .mentorId(chatRoom.getMentorId() != null ? chatRoom.getMentorId() : null) // UUID를 String으로 변환
                .userCount(chatRoom.getUsers().size())
                .build();
    }

    // ✅ 채팅방 접속 시 마지막 접속 시간 업데이트 (프론트에서 호출)
    @PostMapping("/chat/last-seen")
    public ResponseEntity<Void> updateLastSeen(@RequestParam Long roomId, @RequestParam UUID userId) {
        chatService.saveLastSeenTime(roomId, userId);
        return ResponseEntity.ok().build();
    }

    // ✅ 특정 채팅방의 마지막 접속 시간 조회 (Timestamp + Human-readable)
    @GetMapping("/chat/last-seen")
    public ResponseEntity<Map<String, Object>> getLastSeenTime(@RequestParam Long roomId, @RequestParam UUID userId) {
        Long lastSeenTime = chatService.getLastSeenTime(roomId, userId);
        String lastSeenHuman = chatService.getLastSeenTimeHuman(roomId, userId);

        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", lastSeenTime);
        response.put("formattedTime", lastSeenHuman);

        return ResponseEntity.ok(response);
    }

    // ✅ 사용자의 모든 채팅방 마지막 접속 시간 조회
    @GetMapping("/chat/last-seen/all")
    public ResponseEntity<Map<Long, Map<String, Object>>> getAllLastSeenTimes(@RequestParam UUID userId) {
        Map<Long, Map<String, Object>> lastSeenMap = new HashMap<>();

        List<ChatRoom> userRooms = chatService.getUserRooms(userId);
        for (ChatRoom room : userRooms) {
            Long lastSeenTimestamp = chatService.getLastSeenTime(room.getId(), userId);
            String lastSeenFormatted = chatService.getLastSeenTimeHuman(room.getId(), userId);

            Map<String, Object> lastSeenData = new HashMap<>();
            lastSeenData.put("timestamp", lastSeenTimestamp);
            lastSeenData.put("formattedTime", lastSeenFormatted);

            lastSeenMap.put(room.getId(), lastSeenData);
        }

        return ResponseEntity.ok(lastSeenMap);
    }


    // ✅ 특정 채팅방의 안 읽은 메시지 개수 조회
    @GetMapping("/chat/unread-messages")
    public ResponseEntity<Integer> getUnreadMessageCount(@RequestParam Long roomId, @RequestParam UUID userId) {
        Long lastSeenTime = chatService.getLastSeenTime(roomId, userId);
        List<ChatMessage> unreadMessages = chatMessageRepository.findByChatRoomIdAndTimestampGreaterThan(roomId, lastSeenTime);
        return ResponseEntity.ok(unreadMessages.size());
    }
}

