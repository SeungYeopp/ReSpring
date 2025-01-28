package org.ssafy.respring.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.chat.dto.response.ChatMessageResponse;
import org.ssafy.respring.domain.chat.repository.ChatMessageRepository;
import org.ssafy.respring.domain.chat.repository.ChatRoomRepository;
import org.ssafy.respring.domain.chat.vo.ChatMessage;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
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
    private final ChatMessageRepository chatMessageRepository;

    private final Path fileStoragePath = Paths.get("uploads");

    public ChatRoom createRoom(String name, List<String> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            throw new IllegalArgumentException("유효한 유저 ID 리스트를 제공해야 합니다.");
        }

        List<User> users = userIds.stream()
                .map(userId -> {
                    User user = new User();
                    user.setId(UUID.fromString(userId)); // String을 UUID로 변환
                    return user;
                })
                .collect(Collectors.toList());

        ChatRoom chatRoom = ChatRoom.builder()
                .name(name)
                .users(users)
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
        User user = new User();
        user.setId(userId);

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
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found with id: " + roomId));
        User user = new User();
        user.setId(userId);
        ChatMessage message = chatMessageRepository.save(ChatMessage.builder()
                .sender(user.getUsername())
                .receiver(receiver)
                .content(content)
                .timestamp(LocalDateTime.now())
                .read(false)
                .chatRoom(chatRoom)
                .user(user)
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
        User user = new User();
        user.setId(userId);

        if (!Files.exists(fileStoragePath)) {
            Files.createDirectories(fileStoragePath);
        }

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();
        Path targetPath = fileStoragePath.resolve(fileName);
        Files.copy(file.getInputStream(), targetPath);

        return chatMessageRepository.save(ChatMessage.builder()
                .sender(user.getUsername())
                .fileUrl(targetPath.toString())
                .timestamp(LocalDateTime.now())
                .read(false)
                .chatRoom(chatRoom)
                .user(user)
                .build());
    }

    public void deleteMessage(Long messageId, UUID userId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        if (!message.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot delete another user's message");
        }
        chatMessageRepository.delete(message);
    }

    public void markMessageAsRead(Long messageId) {
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        message.setRead(true);
        chatMessageRepository.save(message);
    }

    public List<ChatMessage> getMessages(Long roomId) {
        return chatMessageRepository.findByChatRoomId(roomId);
    }

    public List<ChatMessage> searchMessages(Long roomId, String keyword) {
        return chatMessageRepository.findByContentContainingAndChatRoomId(keyword, roomId);
    }
}
