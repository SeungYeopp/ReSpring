package org.ssafy.respring.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.chat.dto.request.ChatRoomRequest;
import org.ssafy.respring.domain.chat.dto.response.ChatMessageResponse;
import org.ssafy.respring.domain.chat.dto.response.ChatRoomResponse;
import org.ssafy.respring.domain.chat.repository.MongoChatMessageRepository;
import org.ssafy.respring.domain.chat.repository.ChatRoomRepository;
import org.ssafy.respring.domain.chat.vo.ChatMessage;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MongoChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    private final Path fileStoragePath = Paths.get("uploads");

    public ChatRoom createRoom(ChatRoomRequest request) {
        if (request.getUserIds() == null || request.getUserIds().isEmpty()) {
            throw new IllegalArgumentException("유효한 유저 ID 리스트를 제공해야 합니다.");
        }

        List<User> users = request.getUserIds().stream()
                .map(userId -> userRepository.findById(UUID.fromString(userId))
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId)))
                .collect(Collectors.toList());


        ChatRoom chatRoom = ChatRoom.builder()
                .name(request.getName())
                .users(users)
                .isOpenChat(request.isOpenChat()) // 🔹 오픈채팅 여부 설정
                .build();

        return chatRoomRepository.save(chatRoom);
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    public ChatRoom findRoomByName(String name) {
        return chatRoomRepository.findByName(name)
                .orElse(null); // 방이 없으면 null 반환
    }

    public ChatRoom addUserToRoom(Long roomId, UUID userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 채팅방이 존재하지 않습니다."));

        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        // 🔹 이미 참여한 유저인지 확인 후 추가
        if (!chatRoom.getUsers().contains(user)) {
            chatRoom.getUsers().add(user);
            chatRoomRepository.save(chatRoom);
        }

        return chatRoom;
    }

    public Optional<ChatRoom> findById(Long roomId) {
        return chatRoomRepository.findById(roomId);
    }

    public void saveChatRoom(ChatRoom chatRoom) {
        chatRoomRepository.save(chatRoom);
    }



    public ChatMessageResponse saveMessage(Long roomId, UUID userId, String receiver, String content) {
        // MySQL에서 ChatRoom 존재 여부 확인
        chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found: " + roomId));

        ChatMessage message = chatMessageRepository.save(ChatMessage.builder()
                .sender(userId.toString())
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .read(false)
                .chatRoomId(roomId) // MySQL의 ChatRoom과 연결
                .build());

        return ChatMessageResponse.builder()
                .sender(message.getSender())
                .receiver(message.getReceiver())
                .content(message.getContent())
                .read(message.isRead())
                .timestamp(message.getTimestamp())
                .build();
    }


    public ChatMessage saveFileMessage(Long roomId, UUID userId, MultipartFile file) throws IOException {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found with id: " + roomId));

        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        if (!Files.exists(fileStoragePath)) {
            Files.createDirectories(fileStoragePath);
        }

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path targetPath = fileStoragePath.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath);

        return chatMessageRepository.save(ChatMessage.builder()
                .sender(user.getUserNickname())
                .fileUrl(targetPath.toString())
                .timestamp(LocalDateTime.now())
                .read(false)
                .chatRoomId(chatRoom.getId())
                .build());
    }

    public List<ChatMessage> getMessages(Long roomId) {
        return chatMessageRepository.findByChatRoomId(roomId);
    }

    public List<ChatMessage> searchMessages(Long roomId, String keyword) {
        return chatMessageRepository.findByContentContainingAndChatRoomId(keyword, roomId);
    }

    public void deleteMessage(String messageId, UUID userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        if (!message.getSender().equals(userId.toString())) {
            throw new IllegalArgumentException("Cannot delete another user's message");
        }

        chatMessageRepository.delete(message);
    }

    public void markMessageAsRead(String messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));

        message.setRead(true);
        chatMessageRepository.save(message);
    }





    public List<ChatRoom> getUserRooms(UUID userId) {
        return chatRoomRepository.findRoomsByUserId(userId);
    }

    public void removeUserFromRoom(ChatRoom chatRoom, UUID userId) {
        List<User> updatedUsers = chatRoom.getUsers().stream()
                .filter(user -> !user.getId().equals(userId)) // 유저 제외
                .collect(Collectors.toList());

        chatRoom.setUsers(updatedUsers); // 업데이트된 유저 목록 설정
        chatRoomRepository.save(chatRoom);
    }

    public ChatRoomResponse joinRoom(Long roomId, UUID userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        if (chatRoom.getUsers().add(user)) {
            chatRoomRepository.save(chatRoom);
        }

        return ChatRoomResponse.from(chatRoom);
    }

    public void leaveRoom(Long roomId, UUID userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));
        chatRoom.getUsers().removeIf(user -> user.getId().equals(userId));
        chatRoomRepository.save(chatRoom);
    }
}
