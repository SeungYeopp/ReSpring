package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.challenge.dto.request.ChallengeRequestDto;
import org.ssafy.respring.domain.challenge.dto.request.ChallengeUpdateRequestDto;
import org.ssafy.respring.domain.challenge.dto.response.*;
import org.ssafy.respring.domain.challenge.repository.ChallengeLikesRepository;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.repository.UserChallengeRepository;
import org.ssafy.respring.domain.challenge.vo.*;
import org.ssafy.respring.domain.chat.repository.ChatRoomUserRepository;
import org.ssafy.respring.domain.chat.service.ChatService;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.ChatRoomUser;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.notification.service.NotificationService;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.chat.repository.ChatRoomRepository;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;
    private final UserRepository userRepository;
    private final ImageService imageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final RecordsRepository recordsRepository;
    private final ChallengeLikesRepository challengeLikesRepository;
    private final ChatService chatService;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomUserRepository chatRoomUserRepository;
    private final NotificationService notificationService;





    /**
     * 📝 챌린지 생성 (이미지 저장 포함)
     */
    public ChallengeResponseDto createChallenge(ChallengeRequestDto challengeDto, MultipartFile image) {
        User owner = userRepository.findById(challengeDto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + challengeDto.getOwnerId()));

        Challenge challenge = Challenge.builder()
                .title(challengeDto.getTitle())
                .description(challengeDto.getDescription())
                .startDate(challengeDto.getStartDate())
                .endDate(challengeDto.getEndDate())
                .tags(challengeDto.getTags())
                .owner(owner)
                .registerDate(LocalDateTime.now())
                .likes(0L)
                .views(0L)
                .participantCount(1L)
                .build();

        challengeRepository.save(challenge);

        // ✅ Image 테이블에 이미지 저장 (단일 이미지)
        if (image != null) {
            imageService.saveImage(image, ImageType.CHALLENGE, challenge.getId());
        }

        return mapToDto(challenge);
    }

    public void joinChallenge(UUID userId, Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // ✅ 챌린지가 종료되었는지 확인
        if (challenge.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("챌린지가 종료되어 참가할 수 없습니다.");
        }

        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        // ✅ UserChallenge 기록이 없으면 새로 추가 (챌린지 자체에 대한 참가 기록 유지)
        boolean alreadyJoined = userChallengeRepository.existsByUserAndChallenge(user, challenge);

        if (!alreadyJoined) {
            UserChallenge userChallenge = UserChallenge.builder()
                    .user(user)
                    .challenge(challenge)
                    .build();
            userChallengeRepository.save(userChallenge);
            System.out.println("✅ 새로운 챌린지 참가 기록 추가됨");
        }

        // ✅ 참가자 수 증가
        challenge.setParticipantCount(challenge.getParticipantCount() + 1);
        challengeRepository.save(challenge);

        // ✅ UUID 기반 채팅방 참가 (기존 참가자일 경우 `isActive = true`로 변경)
        Optional<ChatRoom> chatRoomOptional = chatService.findByName(challenge.getChatRoomUUID());
        chatRoomOptional.ifPresent(chatRoom -> {
            Optional<ChatRoomUser> existingChatRoomUser = chatRoomUserRepository.findByChatRoomAndUser(chatRoom, user);

            if (existingChatRoomUser.isPresent()) {
                // ✅ 기존 참가 기록이 있으면 `isActive = true`로 변경
                ChatRoomUser chatRoomUser = existingChatRoomUser.get();
                chatRoomUser.setActive(true);
                chatRoomUserRepository.save(chatRoomUser);
                System.out.println("✅ 기존 채팅방 참가 기록 있음 → isActive = true 변경됨");
            } else {
                // ✅ 기존 기록이 없으면 새롭게 추가
                ChatRoomUser newChatRoomUser = ChatRoomUser.builder()
                        .chatRoom(chatRoom)
                        .user(user)
                        .isActive(true) // 기본적으로 활성화
                        .build();
                chatRoomUserRepository.save(newChatRoomUser);
                System.out.println("✅ 새로운 채팅방 참가 기록 추가됨");
            }
        });

        // ✅ WebSocket 이벤트 전송 → 참가자 UI 즉시 갱신
        messagingTemplate.convertAndSend("/topic/newOpenChatRoom/" + userId, challenge.getChatRoomUUID());
    }

    public ChallengeParticipantsResponseDto getChallengeParticipants(Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        List<ParticipantInfoDto> participantList = userChallengeRepository.findByChallenge(challenge)
                .stream()
                .map(userChallenge -> {
                    User user = userChallenge.getUser();
                    return new ParticipantInfoDto(
                            user.getId(),
                            user.getUserNickname(),       // ✅ 닉네임 가져오기
                            user.getProfileImage()    // ✅ 프로필 이미지 가져오기
                    );
                })
                .collect(Collectors.toList());

        return new ChallengeParticipantsResponseDto(
                challenge.getId(),
                participantList.size(),  // ✅ 총 참여자 수
                participantList          // ✅ 닉네임, 프로필 이미지 포함된 리스트
        );
    }
    public List<ChallengeStatusResponseDto> getChallengesByStatus(ChallengeStatus status) {
        LocalDateTime now = LocalDateTime.now();
        List<Challenge> challenges;

        switch (status) {
            case UPCOMING:
                challenges = challengeRepository.findByStartDateAfter(now);
                break;
            case ONGOING:
                challenges = challengeRepository.findByStartDateBeforeAndEndDateAfter(now, now);
                break;
            case COMPLETED:
                challenges = challengeRepository.findByEndDateBefore(now);
                break;
            default:
                throw new IllegalArgumentException("잘못된 챌린지 상태입니다.");
        }

        return challenges.stream()
                .map(challenge -> {
                    // ✅ Image 테이블에서 챌린지에 해당하는 단일 이미지 가져오기
                    String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());

                    return ChallengeStatusResponseDto.builder()
                            .id(challenge.getId())
                            .title(challenge.getTitle())
                            .description(challenge.getDescription())
                            .image(imageUrl) // ✅ Presigned URL 적용
                            .registerDate(challenge.getRegisterDate())
                            .startDate(challenge.getStartDate())
                            .endDate(challenge.getEndDate())
                            .status(getChallengeStatus(challenge))
                            .likes(challenge.getLikes())
                            .views(challenge.getViews())
                            .participantCount(challenge.getParticipantCount())
                            .chatRoomUUID(challenge.getChatRoomUUID()) // ✅ 오픈채팅방 UUID 추가
                            .build();
                })
                .collect(Collectors.toList());
    }






    /**
     * 📝 챌린지 상세 조회 (이미지 포함)
     */
    public ChallengeDetailResponseDto getChallengeDetail(Long challengeId, UUID userId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // ✅ Image 테이블에서 단일 이미지 가져오기
        String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challengeId);

        // ✅ 사용자의 도전 기록 조회
        LocalDate startDate = challenge.getStartDate().toLocalDate();
        LocalDate endDate = challenge.getEndDate().toLocalDate();

        Optional<Records> records = recordsRepository.findByUserAndChallengeAndStartDateAndEndDate(user, challenge, startDate, endDate);

        int successCount = records.map(Records::getSuccessCount).orElse(0);
        int totalDays = records.map(Records::getTotalDays).orElse((int) (endDate.toEpochDay() - startDate.toEpochDay() + 1));
        int longestStreak = records.map(Records::getLongestStreak).orElse(0);
        int currentStreak = records.map(Records::getCurrentStreak).orElse(0);
        double successRate = (totalDays > 0) ? ((double) successCount / totalDays) * 100 : 0.0;

        return ChallengeDetailResponseDto.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .imageUrl(imageUrl) // ✅ 단일 이미지 URL 저장
                .startDate(challenge.getStartDate())
                .endDate(challenge.getEndDate())
                .tags(challenge.getTags())
                .participantCount(challenge.getParticipantCount())
                .likes(challenge.getLikes())
                .views(challenge.getViews())
                .isSuccessToday(successCount > 0) // ✅ 오늘 성공 여부
                .longestStreak(longestStreak) // ✅ 연속 성공 기록
                .currentStreak(currentStreak) // ✅ 현재 연속 성공 기록
                .successRate(successRate) // ✅ 성공률
                .ownerId(challenge.getOwner().getId()) // ✅ 챌린지 OwnerId 추가
                .records(records.orElse(null)) // ✅ 사용자의 도전 기록 반환
                .build();
    }

    public List<ChallengeListResponseDto> getAllChallenges(ChallengeSortType sortType) {
        List<Challenge> challenges = challengeRepository.findAll();

        // ✅ 선택된 정렬 기준에 따라 정렬 수행
        challenges.sort((c1, c2) -> {
            switch (sortType) {
                case MOST_LIKED:
                    return Long.compare(c2.getLikes(), c1.getLikes()); // ✅ 좋아요 많은 순
                case MOST_VIEWED:
                    return Long.compare(c2.getViews(), c1.getViews()); // ✅ 조회수 많은 순
                case MOST_PARTICIPATED:
                    return Long.compare(c2.getParticipantCount(), c1.getParticipantCount()); // ✅ 참가자 많은 순
                case LATEST:
                default:
                    return c2.getRegisterDate().compareTo(c1.getRegisterDate()); // ✅ 최신순
            }
        });

        return challenges.stream()
                .map(ch -> {
                    // ✅ Image 테이블에서 단일 이미지 가져오기
                    String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, ch.getId());

                    return new ChallengeListResponseDto(
                            ch.getId(),
                            ch.getTitle(),
                            ch.getDescription(),
                            imageUrl, // ✅ ImageService에서 가져온 이미지 URL 적용
                            ch.getRegisterDate(),
                            ch.getLikes(),
                            ch.getViews(),
                            ch.getParticipantCount(),
                            getChallengeStatus(ch)
                    );
                })
                .collect(Collectors.toList());
    }

    public void leaveChallenge(UUID userId, Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // ✅ 챌린지가 종료되었는지 확인
        if (challenge.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("챌린지가 종료되어 나갈 수 없습니다.");
        }

        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        // 🔥 Owner는 챌린지를 나갈 수 없음
//        if (challenge.getOwner().getId().equals(userId)) {
//            throw new IllegalStateException("챌린지 생성자는 챌린지를 나갈 수 없습니다. 삭제만 가능합니다.");
//        }

        // 참가 기록 찾기
        UserChallenge userChallenge = userChallengeRepository.findByUserAndChallenge(user, challenge)
                .orElseThrow(() -> new RuntimeException("참가 기록을 찾을 수 없습니다."));

        // 참가 기록 삭제
        userChallengeRepository.delete(userChallenge);
        challenge.setParticipantCount(challenge.getParticipantCount() - 1);

        // ✅ UUID 기반 채팅방에서 나가기
        Optional<ChatRoom> chatRoomOptional = chatService.findByName(challenge.getChatRoomUUID());
        chatRoomOptional.ifPresent(chatRoom -> chatService.leaveRoom(chatRoom.getId(), userId));

        // ✅ WebSocket 이벤트 전송 → 챌린지 리스트 즉시 갱신
        messagingTemplate.convertAndSend("/topic/updateChallengeList/" + userId, challenge.getId());

        // 🔥 참가자가 0명이면 챌린지 자동 삭제
        if (challenge.getParticipantCount() == 0) {
            challengeRepository.delete(challenge);
            // 🔥 챌린지 삭제 시 오픈채팅방도 삭제
            chatRoomOptional.ifPresent(chatRoom -> chatService.deleteRoom(chatRoom.getId()));
        }


    }


    public ChallengeStatus getChallengeStatus(Challenge challenge) {
        LocalDateTime now = LocalDateTime.now();
        if (challenge.getStartDate().isAfter(now)) {
            return ChallengeStatus.UPCOMING; // 시작 전
        } else if (challenge.getEndDate().isAfter(now)) {
            return ChallengeStatus.ONGOING; // 진행 중
        } else {
            return ChallengeStatus.COMPLETED; // 종료됨
        }
    }


// ✅ 챌린지 검색 기능 (키워드 기반)
    public List<ChallengeListResponseDto> searchChallenges(String keyword) {
        return challengeRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .sorted((c1, c2) -> c2.getRegisterDate().compareTo(c1.getRegisterDate())) // 최신순 정렬
                .map(ch -> {
                    // ✅ Image 테이블에서 챌린지에 해당하는 단일 이미지 가져오기
                    String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, ch.getId());

                    return ChallengeListResponseDto.builder()
                            .id(ch.getId())
                            .title(ch.getTitle())
                            .description(ch.getDescription())
                            .image(imageUrl) // ✅ ImageService에서 가져온 Presigned URL 적용
                            .registerDate(ch.getRegisterDate())
                            .likes(ch.getLikes())
                            .views(ch.getViews())
                            .participantCount(ch.getParticipantCount())
                            .status(getChallengeStatus(ch))
                            .build();
                })
                .collect(Collectors.toList());
    }


    public List<ChallengeMyListResponseDto> getParticipatedChallenges(UUID userId) {
        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        return userChallengeRepository.findByUser(user).stream()
                .map(UserChallenge::getChallenge) // UserChallenge에서 Challenge 가져오기
                .sorted((c1, c2) -> c2.getRegisterDate().compareTo(c1.getRegisterDate())) // 최신순 정렬
                .map(challenge -> {
                    // ✅ Image 테이블에서 챌린지에 해당하는 단일 이미지 가져오기
                    String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());

                    // ✅ 해당 챌린지에서 사용자의 최신 기록 조회
                    Optional<Records> record = recordsRepository.findTopByUserAndChallengeOrderByStartDateDesc(user, challenge);

                    int currentStreak = record.map(Records::getCurrentStreak).orElse(0);
                    int tagCount = challenge.getTags() != null ? challenge.getTags().size() : 0; // ✅ 태그 개수 계산

                    return ChallengeMyListResponseDto.builder()
                            .id(challenge.getId())
                            .title(challenge.getTitle())
                            .image(imageUrl) // ✅ Presigned URL 적용
                            .registerDate(challenge.getRegisterDate())
                            .tags(challenge.getTags()) // ✅ 태그 추가
                            .tagCount(tagCount) // ✅ 태그 개수 추가
                            .currentStreak(currentStreak) // ✅ 현재 연속 도전 일수 추가
                            .build();
                })
                .collect(Collectors.toList());
    }

    public void toggleLike(UUID userId, Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // ✅ 챌린지가 종료되었는지 확인
        if (challenge.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("챌린지가 종료되어 좋아요를 변경할 수 없습니다.");
        }

        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        // 좋아요 여부 확인
        challengeLikesRepository.findByUserAndChallenge(user, challenge).ifPresentOrElse(
                like -> {
                    // 이미 좋아요가 되어 있다면 삭제 (좋아요 취소)
                    challengeLikesRepository.delete(like);
                    challenge.setLikes(challenge.getLikes() - 1);
                },
                () -> {
                    // 좋아요가 없다면 추가
                    ChallengeLikes userLikes = ChallengeLikes.builder()
                            .user(user)
                            .challenge(challenge)
                            .build();
                    challengeLikesRepository.save(userLikes);
                    challenge.setLikes(challenge.getLikes() + 1);

                    // ✅ 챌린지 소유자에게 알림 전송
                    UUID ownerId = challenge.getOwner().getId();

                    // ✅ 본인이 만든 챌린지에 좋아요를 누르면 알림을 보내지 않음
                    if (!ownerId.equals(userId)) {
                        notificationService.sendNotification(
                                ownerId, // ✅ 알림 받는 사람 (챌린지 작성자)
                                NotificationType.LIKE,
                                TargetType.CHALLENGE,
                                challengeId,
                                "🔥 " + user.getUserNickname() + "님이 당신의 챌린지를 좋아합니다!"
                        );
                    }
                }
        );
    }






    /**
     * 📝 챌린지 수정 (이미지 변경 포함)
     */
    public ChallengeResponseDto updateChallenge(Long challengeId, ChallengeUpdateRequestDto updateDto, MultipartFile image) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        // ✅ Owner 검증
        if (!challenge.getOwner().getId().equals(updateDto.getOwnerId())) {
            throw new IllegalStateException("챌린지를 수정할 권한이 없습니다.");
        }

        // ✅ 필드 업데이트
        if (updateDto.getDescription() != null) {
            challenge.setDescription(updateDto.getDescription());
        }
        if (updateDto.getEndDate() != null) {
            challenge.setEndDate(updateDto.getEndDate().atStartOfDay());
        }

        // ✅ 기존 이미지 삭제 후 새 이미지 저장
        if (image != null) {
            imageService.deleteImages(ImageType.CHALLENGE, challengeId);
            imageService.saveImage(image, ImageType.CHALLENGE, challengeId);
        }

        return mapToDto(challenge);
    }

    /**
     * 📝 Challenge → ChallengeResponseDto 변환
     */
    private ChallengeResponseDto mapToDto(Challenge challenge) {
        String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());

        return new ChallengeResponseDto(
                challenge.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                imageUrl,
                challenge.getRegisterDate(),
                challenge.getStartDate(),
                challenge.getEndDate(),
                challenge.getTags(),
                challenge.getLikes(),
                challenge.getViews(),
                challenge.getParticipantCount(),
                challenge.getOwner().getId(),
                challenge.getChatRoomUUID()
        );
    }
}
