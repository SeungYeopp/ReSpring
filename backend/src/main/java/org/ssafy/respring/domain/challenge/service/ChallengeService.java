package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.challenge.dto.request.ChallengeRequestDto;
import org.ssafy.respring.domain.challenge.dto.request.ChallengeUpdateRequestDto;
import org.ssafy.respring.domain.challenge.dto.response.*;
import org.ssafy.respring.domain.challenge.repository.ChallengeLikesRepository;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.challenge.repository.UserChallengeRepository;
import org.ssafy.respring.domain.challenge.vo.*;
import org.ssafy.respring.domain.chat.dto.request.ChatRoomRequest;
import org.ssafy.respring.domain.chat.repository.ChatRoomRepository;
import org.ssafy.respring.domain.chat.repository.ChatRoomUserRepository;
import org.ssafy.respring.domain.chat.service.ChatService;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.ChatRoomUser;
import org.ssafy.respring.domain.image.service.ImageService;

import org.ssafy.respring.domain.tag.repository.ChallengeTagRepository;
import org.ssafy.respring.domain.tag.repository.TagRepository;
import org.ssafy.respring.domain.tag.vo.ChallengeTag;
import org.ssafy.respring.domain.tag.vo.Tag;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.notification.service.NotificationService;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.chat.repository.ChatRoomRepository;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;
    private final ChallengeLikesRepository challengeLikesRepository;
    private final RecordsRepository recordsRepository;
    private final UserRepository userRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final TagRepository tagRepository;
    private final ChallengeTagRepository challengeTagRepository;

    private final ChatService chatService;
    private final ImageService imageService;
    private final SimpMessagingTemplate messagingTemplate;

    private final ChatRoomUserRepository chatRoomUserRepository;
    private final NotificationService notificationService;

    // ✅ RedisTemplate 추가
    private final RedisTemplate<String, List<Challenge>> challengeRedisTemplate;

    public ChallengeResponseDto createChallenge(ChallengeRequestDto challengeDto, MultipartFile image, UUID ownerId) throws IOException {
        // ✅ 1️⃣ User 가져오기
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + ownerId));

        // ✅ 2️⃣ 오픈채팅방 생성
        ChatRoom chatRoom = chatService.createRoom(ChatRoomRequest.builder()
                .name(challengeDto.getTitle())
                .userIds(List.of(owner.getId().toString()))
                .isOpenChat(true)
                .build());
        chatRoomRepository.save(chatRoom);

        // ✅ 3️⃣ Challenge 생성 및 저장 (채팅방 ID 포함)
        Challenge challenge = Challenge.builder()
                .title(challengeDto.getTitle())
                .description(challengeDto.getDescription())
                .startDate(challengeDto.getStartDate())
                .endDate(challengeDto.getEndDate())
                .owner(owner)
                .registerDate(LocalDateTime.now())
                .likes(0L)
                .views(0L)
                .participantCount(1L)
                .chatRoomId(chatRoom.getId()) // ✅ 채팅방 ID 설정
                .build();

        Challenge savedChallenge = challengeRepository.save(challenge);

        // ✅ 챌린지-유저 매핑 추가 (챌린지 생성자는 자동 참가)
        UserChallenge userChallenge = UserChallenge.builder()
                .user(owner)
                .challenge(savedChallenge)
                .build();
        userChallengeRepository.save(userChallenge);


        // ✅ 4️⃣ Image 테이블에 이미지 저장 (단일 이미지)
        if (image != null) {
            imageService.saveImage(image, ImageType.CHALLENGE, challenge.getId());
        }

        // ✅ 5️⃣ ChallengeTag 생성 및 저장
        Set<String> tagNames = challengeDto.getTags();
        List<ChallengeTag> challengeTags = new ArrayList<>();

        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));

            challengeTags.add(ChallengeTag.builder()
                    .challenge(savedChallenge)
                    .tag(tag)
                    .build());
        }

        challengeTagRepository.saveAll(challengeTags);

        // ✅ 6️⃣ DTO 변환
        return mapToDto(savedChallenge, challengeTags, ownerId);
    }


    // ✅ 챌린지 리스트 조회 (필터링 가능)
    public List<ChallengeListResponseDto> getAllChallenges(ChallengeSortType sortType, UUID userId) {
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
                .map(ch -> new ChallengeListResponseDto(
                        ch.getId(), ch.getTitle(), ch.getDescription(), imageService.getSingleImageByEntity(ImageType.CHALLENGE, ch.getId()), ch.getRegisterDate(),
                        tagRepository.findTagsByChallengeId(ch.getId()).stream().collect(Collectors.toSet()),
                        isLikedChallenge(userId, ch.getId()),
                        ch.getLikes(), ch.getViews(), ch.getParticipantCount(), getChallengeStatus(ch)
                ))
                .collect(Collectors.toList());
    }


    @Transactional
    public ChallengeDetailResponseDto getChallengeDetail(Long challengeId, UUID userId) {
        Challenge challenge = challengeRepository.findById(challengeId)
          .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        LocalDate startDate = challenge.getStartDate().toLocalDate();
        LocalDate endDate = challenge.getEndDate().toLocalDate();

        // 🔹 챌린지 소유자 정보 가져오기
        User owner = challenge.getOwner();

        int successCount =0;
        int totalDays = (int) (endDate.toEpochDay() - startDate.toEpochDay() + 1);
        int longestStreak = 0;
        int currentStreak = 0;
        double successRate = 0.0;

        Optional<Records> records = Optional.empty();

        // 🔹 User 엔티티 조회
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

            records = recordsRepository.findByUserAndChallengeAndStartDateAndEndDate(user, challenge, startDate, endDate);

            successCount = records.map(Records::getSuccessCount).orElse(0);
            totalDays = records.map(Records::getTotalDays).orElse(totalDays);
            longestStreak = records.map(Records::getLongestStreak).orElse(0);
            currentStreak = records.map(Records::getCurrentStreak).orElse(0);
            successRate = (totalDays > 0) ? ((double) successCount / totalDays) * 100 : 0.0;

        }

        // ✅ 조회수 증가 (JPA Lock 사용)
        challengeRepository.incrementViews(challengeId);

        // ✅ ChallengeTag -> Tag 변환 (JOIN FETCH 사용)
        List<Tag> tags = tagRepository.findTagsByChallengeId(challengeId);

        String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());

        return ChallengeDetailResponseDto.builder()
          .id(challenge.getId())
          .title(challenge.getTitle())
          .description(challenge.getDescription())
          .imageUrl(imageUrl)
          .startDate(challenge.getStartDate())
          .endDate(challenge.getEndDate())
          .tags(new HashSet<>(tags)) // ✅ 중복 제거된 태그 리스트 반환
          .participantCount(challenge.getParticipantCount())
          .likes(challenge.getLikes())
          .views(challenge.getViews())
          .isSuccessToday(successCount > 0)
          .longestStreak(longestStreak) // ✅ 연속 성공 기록
          .currentStreak(currentStreak) // ✅ 현재 연속 성공 기록
          .successRate(successRate) // ✅ 성공률
          .ownerName(owner.getUserNickname()) // ✅ 챌린지 OwnerId 추가
          .ownerProfileImage(owner.getProfileImage())
          .records(records.orElse(null))
          .build();
    }


    // 챌린지 참가 (N:M 관계 추가)
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
        Optional<ChatRoom> chatRoomOptional = chatService.findById(challenge.getChatRoomId());
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
        messagingTemplate.convertAndSend("/topic/newOpenChatRoom/" + userId, challenge.getChatRoomId());
    }



    @Transactional
    public void leaveChallenge(UUID userId, Long challengeId) {
        // ✅ 1️⃣ 챌린지 조회
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("챌린지를 찾을 수 없습니다."));

        // ✅ 2️⃣ 챌린지가 이미 종료되었는지 확인
        if (challenge.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("챌린지가 종료되어 나갈 수 없습니다.");
        }

        // ✅ 3️⃣ User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        // ✅ 4️⃣ 참가 기록 확인 (없으면 예외 발생)
        UserChallenge userChallenge = userChallengeRepository.findByUserAndChallenge(user, challenge)
                .orElseThrow(() -> new IllegalStateException("사용자가 해당 챌린지에 참가한 기록이 없습니다."));

        // ✅ 5️⃣ 참가 기록 삭제
        userChallengeRepository.delete(userChallenge);

        // ✅ 6️⃣ 참가자 수 감소 후 DB 반영
        challenge.setParticipantCount(challenge.getParticipantCount() - 1);
        challengeRepository.save(challenge); // ✅ 변경된 값 저장

        // ✅ 7️⃣ 채팅방에서 유저 삭제 (참가 중인지 확인 후 삭제)
        Optional<ChatRoom> chatRoomOptional = chatService.findById(challenge.getChatRoomId());
        chatRoomOptional.ifPresent(chatRoom -> {
            Optional<ChatRoomUser> chatRoomUser = chatRoomUserRepository.findByChatRoomAndUser(chatRoom, user);
            chatRoomUser.ifPresent(chatRoomUserRepository::delete); // ✅ 존재하면 삭제
        });

        // ✅ 8️⃣ WebSocket 이벤트 전송 → 챌린지 UI 갱신
        messagingTemplate.convertAndSend("/topic/updateChallengeList/" + userId, challenge.getId());

        // ✅ 9️⃣ 참가자가 0명이면 챌린지 & 채팅방 삭제
        if (challenge.getParticipantCount() == 0) {
            // 🚨 🔥 **챌린지를 삭제하기 전에 `challenge_tag` 데이터 먼저 삭제!**
            challengeTagRepository.deleteByChallengeId(challenge.getId());

            // ✅ 챌린지 삭제
            challengeRepository.delete(challenge);

            // ✅ 채팅방 삭제
            chatRoomOptional.map(ChatRoom::getId).ifPresent(chatService::deleteRoom);

        }
    }


    // ✅ 좋아요(Toggle) 기능
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
        challengeLikesRepository.findByUserIdAndChallengeId(challengeId, userId).ifPresentOrElse(
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

    // ✅ 내가 참여한 챌린지 목록 조회 (태그 개수 & 현재 연속 도전 포함)
    public List<ChallengeMyListResponseDto> getParticipatedChallenges(UUID userId) {
        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
          .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        return userChallengeRepository.findByUser(user).stream()
          .map(UserChallenge::getChallenge) // UserChallenge에서 Challenge 가져오기
          .sorted((c1, c2) -> c2.getRegisterDate().compareTo(c1.getRegisterDate())) // 최신순 정렬
          .map(challenge -> {
              // ✅ 해당 챌린지에서 사용자의 최신 기록 조회
              Optional<Records> record = recordsRepository.findTopByUserAndChallengeOrderByStartDateDesc(user, challenge);
              int currentStreak = record.map(Records::getCurrentStreak).orElse(0);

              // ✅ Challenge에 연결된 태그 조회 (ChallengeTagRepository 사용)
              List<ChallengeTag> challengeTags = challengeTagRepository.findByChallengeId(challenge.getId());
              System.out.println("✅ Challenge ID: " + challenge.getId() + " 에 대한 태그 개수: " + challengeTags.size());

              // ✅ ChallengeTag → Tag 변환
              Set<Tag> tags = challengeTags.stream()
                .map(ChallengeTag::getTag)
                .collect(Collectors.toSet());




              return new ChallengeMyListResponseDto(
                challenge.getId(),
                challenge.getTitle(),
                imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId()),
                challenge.getRegisterDate(),
                tags, // ✅ `Set<Tag>` 반환
                tags.size(), // ✅ 태그 개수 추가
                currentStreak // ✅ 현재 연속 도전 일수 추가
              );
          })
          .collect(Collectors.toList());
    }

    // ✅ 챌린지 수정 (Owner만 가능)
    public ChallengeResponseDto updateChallenge(Long challengeId, ChallengeUpdateRequestDto updateDto, MultipartFile image, UUID ownerId) throws IOException {
        Challenge challenge = challengeRepository.findById(challengeId)
          .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        // ✅ 챌린지가 종료되었는지 확인
        if (challenge.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("챌린지가 종료되어 수정할 수 없습니다.");
        }

        // ✅ Owner 검증
        if (!challenge.getOwner().getId().equals(ownerId)) {
            throw new IllegalStateException("챌린지를 수정할 권한이 없습니다.");
        }

        // ✅ description 수정
        if (updateDto.getDescription() != null) {
            challenge.setDescription(updateDto.getDescription());
        }

        // ✅ endDate 수정
        if (updateDto.getEndDate() != null) {
            challenge.setEndDate(updateDto.getEndDate().atStartOfDay());
        }

        // ✅ 기존 이미지 삭제 후 새 이미지 저장
        if (image != null) {
            imageService.deleteImages(ImageType.CHALLENGE, challengeId);
            imageService.saveImage(image, ImageType.CHALLENGE, challengeId);
        }

        // ✅ 태그 업데이트 처리 (새로운 태그가 제공된 경우)
        if (updateDto.getTags() != null) {
            // 기존 태그 삭제
            challengeTagRepository.deleteByChallengeId(challengeId);

            // 새로운 태그 추가
            Set<ChallengeTag> newTags = updateDto.getTags().stream()
              .map(tagName -> {
                  Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(tagName).build()));

                  return ChallengeTag.builder()
                    .challenge(challenge)
                    .tag(tag)
                    .build();
              })
              .collect(Collectors.toSet());

            challengeTagRepository.saveAll(newTags);
        }

        // ✅ 저장 후 DTO 변환
        challengeRepository.save(challenge);
        return mapToDto(challenge, challengeTagRepository.findByChallengeId(challenge.getId()), ownerId);
    }


    // ✅ 챌린지 검색 기능
    public List<ChallengeListResponseDto> searchChallenges(String keyword, UUID userId) {
        return challengeRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .sorted((c1, c2) -> c2.getRegisterDate().compareTo(c1.getRegisterDate())) // 최신순 정렬
                .map(ch -> new ChallengeListResponseDto(
                        ch.getId(), ch.getTitle(), ch.getDescription(),
                        imageService.getSingleImageByEntity(ImageType.CHALLENGE, ch.getId()),
                        ch.getRegisterDate(),
                        tagRepository.findTagsByChallengeId(ch.getId()).stream().collect(Collectors.toSet()),
                        isLikedChallenge(userId, ch.getId()),
                        ch.getLikes(), ch.getViews(), ch.getParticipantCount(), getChallengeStatus(ch)
                ))
                .collect(Collectors.toList());
    }



    // ✅ 챌린지 참여자 조회 (총 참여자 수 & 참여자 ID 리스트 반환)
    public ChallengeParticipantsResponseDto getChallengeParticipants(Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        List<ParticipantInfoDto> participantList = userChallengeRepository.findByChallenge(challenge)
                .stream()
                .map(userChallenge -> {
                    User user = userChallenge.getUser();
                    return new ParticipantInfoDto(
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
                            .chatRoomId(challenge.getChatRoomId()) // ✅ 오픈채팅방 UUID 추가
                            .build();
                })
                .collect(Collectors.toList());
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

    private boolean isLikedChallenge(UUID userId, Long challengeId) {
        return (userId != null) &&
                challengeLikesRepository.findByUserIdAndChallengeId(challengeId, userId).isPresent();
    }

    // 🆕 mapToDto 추가: Challenge -> ChallengeResponseDto 변환
    private ChallengeResponseDto mapToDto(Challenge challenge, List<ChallengeTag> challengeTags, UUID userId) {
        String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());
        Set<Tag> tags = challengeTags.stream()
                .map(challengeTag -> new Tag(challengeTag.getTag().getId(), challengeTag.getTag().getName()))
                .collect(Collectors.toSet());

        // ✅ 좋아요 여부 확인
        boolean isLiked = isLikedChallenge(userId, challenge.getId());

        return new ChallengeResponseDto(
          challenge.getId(),
          challenge.getTitle(),
          challenge.getDescription(),
          imageUrl,
          challenge.getRegisterDate(),
          challenge.getStartDate(),
          challenge.getEndDate(),
          tags, // ✅ TagDto 리스트 반환
          isLiked,
          challenge.getLikes(),
          challenge.getViews(),
          challenge.getParticipantCount(),
          challenge.getOwner().getUserNickname(),
          challenge.getChatRoomId()
        );
    }
}

