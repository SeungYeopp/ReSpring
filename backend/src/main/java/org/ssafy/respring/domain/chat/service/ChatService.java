package org.ssafy.respring.domain.chat.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.chat.dto.request.ChatRoomRequest;
import org.ssafy.respring.domain.chat.dto.response.ChatMessageResponse;
import org.ssafy.respring.domain.chat.dto.response.ChatRoomResponse;
import org.ssafy.respring.domain.chat.repository.ChatRoomUserRepository;
import org.ssafy.respring.domain.chat.repository.MongoChatMessageRepository;
import org.ssafy.respring.domain.chat.repository.ChatRoomRepository;
import org.ssafy.respring.domain.chat.vo.ChatMessage;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.ChatRoomUser;
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
    private final ChallengeRepository challengeRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;

    private final Path fileStoragePath = Paths.get("uploads");

    public ChatRoom createRoom(ChatRoomRequest request) {
        if (request.getUserIds() == null || request.getUserIds().isEmpty()) {
            throw new IllegalArgumentException("유효한 유저 ID 리스트를 제공해야 합니다.");
        }

        List<User> users = request.getUserIds().stream()
                .map(userId -> userRepository.findById(UUID.fromString(userId))
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId)))
                .collect(Collectors.toList());

        // ✅ 채팅방 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .name(request.getName())
                .isOpenChat(request.isOpenChat()) // 오픈채팅 여부 설정
                .build();

        chatRoomRepository.save(chatRoom);

        // ✅ 채팅방-유저 관계 저장
        users.forEach(user -> {
            chatRoomUserRepository.save(ChatRoomUser.builder()
                    .chatRoom(chatRoom)
                    .user(user)
                    .isActive(true)  // 새로 생성된 방에서는 기본적으로 활성화
                    .build());
        });

        return chatRoom;
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

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        boolean alreadyJoined = chatRoom.getChatRoomUsers().stream()
                .anyMatch(chatRoomUser -> chatRoomUser.getUser().getId().equals(userId));

        if (alreadyJoined) {
            System.out.println("⚠️ 이미 채팅방에 참가한 유저: " + userId);
            return chatRoom;
        }

        ChatRoomUser chatRoomUser = ChatRoomUser.builder()
                .chatRoom(chatRoom)
                .user(user)
                .isActive(true)
                .build();

        chatRoomUserRepository.save(chatRoomUser);
        System.out.println("✅ 채팅방에 새 유저 추가: " + userId);

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
                .orElseThrow(() -> new IllegalArgumentException("❌ 채팅방을 찾을 수 없습니다."));

        // 🔹 1:1 채팅방인지 확인 (isOpenChat = false이면 1:1 채팅방)
        if (!chatRoom.isOpenChat()) {
            System.out.println("✅ 1:1 채팅방 - 챌린지 조회 없이 메시지 저장");
        } else {
            // ✅ 오픈 채팅방일 경우에만 챌린지 조회
            Challenge challenge = challengeRepository.findByChatRoomUUID(chatRoom.getName())
                    .orElseThrow(() -> new IllegalArgumentException("❌ 해당 챌린지와 연결된 채팅방을 찾을 수 없습니다."));

            // ✅ 챌린지가 종료되었는지 확인
            if (challenge.getEndDate().isBefore(LocalDateTime.now())) {
                throw new IllegalStateException("❌ 챌린지가 종료되어 채팅을 보낼 수 없습니다.");
            }
        }

        // ✅ 메시지 저장
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
//
//    public void removeUserFromRoom(ChatRoom chatRoom, UUID userId) {
//        List<User> updatedUsers = chatRoom.getUsers().stream()
//                .filter(user -> !user.getId().equals(userId)) // 유저 제외
//                .collect(Collectors.toList());
//
//        chatRoom.setUsers(updatedUsers); // 업데이트된 유저 목록 설정
//        chatRoomRepository.save(chatRoom);
//    }

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
                .orElseThrow(() -> new IllegalArgumentException("❌ 채팅방이 존재하지 않습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        ChatRoomUser chatRoomUser = chatRoomUserRepository.findByChatRoomAndUser(chatRoom, user)
                .orElseThrow(() -> new IllegalArgumentException("❌ 해당 유저가 채팅방에 없음"));

        // ✅ isActive 상태만 변경 (삭제 X)
        chatRoomUser.setActive(false);
        chatRoomUserRepository.save(chatRoomUser);

        System.out.println("✅ 사용자가 나갔음: " + userId);

        // ✅ 1:1 채팅방에서 두 명 다 나갔으면 삭제
        if (!chatRoom.isOpenChat()) {
            long activeUsers = chatRoom.getUsers().stream().filter(u ->
                    chatRoomUserRepository.findByChatRoomAndUser(chatRoom, u).get().isActive()
            ).count();

            if (activeUsers == 0) {
                chatRoomRepository.delete(chatRoom);
                System.out.println("✅ 1:1 채팅방 삭제됨: " + roomId);
            }
        }
    }



    public Optional<ChatRoom> findByName(String chatRoomUUID) {
        return chatRoomRepository.findByName(chatRoomUUID);
    }

    public void deleteRoom(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));
        chatRoomRepository.delete(chatRoom);
    }

    public ChatRoom getOrJoinPrivateRoom(UUID user1Id, UUID user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + user1Id));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + user2Id));

        // ✅ 정확한 두 명이 포함된 기존 방 찾기
        Optional<ChatRoom> existingRoomOpt = chatRoomRepository.findExactPrivateRoom(user1, user2);

        if (existingRoomOpt.isPresent()) {
            ChatRoom existingRoom = existingRoomOpt.get();
            System.out.println("✅ 기존 1:1 채팅방 재사용: " + existingRoom.getId());

            // ✅ 나갔던 사용자가 다시 들어오면 isActive = true로 변경
            existingRoom.getChatRoomUsers().forEach(chatRoomUser -> {
                if (chatRoomUser.getUser().equals(user1) || chatRoomUser.getUser().equals(user2)) {
                    chatRoomUser.setActive(true);
                    chatRoomUserRepository.save(chatRoomUser);
                }
            });

            return existingRoom;
        }

        // ✅ 기존 방이 없으면 자동 생성
        System.out.println("✅ 새로운 1:1 채팅방 생성");
        ChatRoom chatRoom = ChatRoom.builder()
                .name("Private Chat: " + user1.getUserNickname() + " & " + user2.getUserNickname())
                .isOpenChat(false)
                .build();
        chatRoomRepository.save(chatRoom);

        chatRoomUserRepository.save(ChatRoomUser.builder()
                .chatRoom(chatRoom)
                .user(user1)
                .isActive(true)
                .build());

        chatRoomUserRepository.save(ChatRoomUser.builder()
                .chatRoom(chatRoom)
                .user(user2)
                .isActive(true)
                .build());

        return chatRoom;
    }






}
