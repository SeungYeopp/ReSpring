package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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
import org.ssafy.respring.domain.user.vo.User;

import java.io.File;
import java.io.IOException;
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
    private final ChallengeLikesRepository challengeLikesRepository;
    private final RecordsRepository recordsRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // ✅ 이미지 저장 메서드
    private String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String originalFileName = file.getOriginalFilename();
        String extension = originalFileName != null && originalFileName.contains(".") ?
                originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        String filePath = uploadDir + File.separator + uniqueFileName;
        file.transferTo(new File(filePath));

        return filePath; // 이미지 URL 반환
    }

    // 챌린지 생성 (Owner 지정)
    public ChallengeResponseDto createChallenge(ChallengeRequestDto challengeDto, MultipartFile image) throws IOException {
        User owner = new User();
        owner.setId(challengeDto.getOwnerId());

        File uploadDirFolder = new File(uploadDir);
        if (!uploadDirFolder.exists()) {
            if (!uploadDirFolder.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory: " + uploadDir);
            }
        }

        // 이미지 저장 후 URL 반환
        String imageUrl = saveImage(image);

        Challenge challenge = Challenge.builder()
                .title(challengeDto.getTitle())
                .description(challengeDto.getDescription())
                .image(imageUrl) // ✅ 저장된 이미지 URL 추가
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

        UserChallenge userChallenge = UserChallenge.builder()
                .user(owner)
                .challenge(challenge)
                .build();

        userChallengeRepository.save(userChallenge);
        return mapToDto(challenge);
    }

    // ✅ 챌린지 리스트 조회 (필터링 가능)
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
                .map(ch -> new ChallengeListResponseDto(
                        ch.getId(), ch.getTitle(), ch.getDescription(), ch.getImage(), ch.getRegisterDate(), ch.getLikes(), ch.getViews(), ch.getParticipantCount()
                ))
                .collect(Collectors.toList());
    }


    // 챌린지 상세 조회
    public ChallengeDetailResponseDto getChallengeDetail(Long challengeId, UUID userId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        User user = new User();
        user.setId(userId);

        LocalDate startDate = challenge.getStartDate().toLocalDate();
        LocalDate endDate = challenge.getEndDate().toLocalDate();

        Optional<Records> record = recordsRepository.findByUserAndChallengeAndStartDateAndEndDate(user, challenge, startDate, endDate);

        int successCount = record.map(Records::getSuccessCount).orElse(0);
        int totalDays = record.map(Records::getTotalDays).orElse((int) (endDate.toEpochDay() - startDate.toEpochDay() + 1));
        int longestStreak = record.map(Records::getLongestStreak).orElse(0);
        int currentStreak = record.map(Records::getCurrentStreak).orElse(0);
        double successRate = (totalDays > 0) ? ((double) successCount / totalDays) * 100 : 0.0;
        challenge.setViews(challenge.getViews() + 1);

        return ChallengeDetailResponseDto.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .image(challenge.getImage())
                .startDate(challenge.getStartDate())
                .endDate(challenge.getEndDate())
                .tags(challenge.getTags())
                .participantCount(challenge.getParticipantCount())
                .likes(challenge.getLikes())
                .views(challenge.getViews())
                .isSuccessToday(successCount > 0)
                .longestStreak(longestStreak) // ✅ 연속 성공 기록
                .currentStreak(currentStreak) // ✅ 현재 연속 성공 기록
                .successRate(successRate) // ✅ 성공률 계산
                .build();
    }


//    public void deleteChallenge(Long id, UUID ownerId) {
//        Challenge challenge = challengeRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));
//
//        if (!challenge.getOwner().getId().equals(ownerId)) {
//            throw new IllegalStateException("삭제 권한이 없습니다.");
//        }
//
//        // 🔥 참여자 수 확인: Owner 혼자일 때만 삭제 가능
//        long participantCount = userChallengeRepository.findByChallenge(challenge).size();
//
//        if (participantCount > 1) {
//            throw new IllegalStateException("참여자가 존재하므로 챌린지를 삭제할 수 없습니다.");
//        }
//
//        // 참여자가 Owner 1명뿐이면 삭제
//        userChallengeRepository.deleteAll(userChallengeRepository.findByChallenge(challenge)); // UserChallenge 삭제
//        challengeRepository.delete(challenge); // Challenge 삭제
//    }

    // 챌린지 참가 (N:M 관계 추가)
    public void joinChallenge(UUID userId, Long challengeId) {
        User user = new User();
        user.setId(userId);

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        // 이미 참가한 경우 방지
        boolean alreadyJoined = userChallengeRepository.findByUser(user).stream()
                .anyMatch(uc -> uc.getChallenge().equals(challenge));

        if (alreadyJoined) {
            throw new IllegalStateException("이미 참가한 챌린지입니다.");
        }

        UserChallenge userChallenge = UserChallenge.builder()
                .user(user)
                .challenge(challenge)
                .build();

        userChallengeRepository.save(userChallenge);
        challenge.setParticipantCount(challenge.getParticipantCount() + 1);
    }

    // ✅ 챌린지 나가기 기능
    public void leaveChallenge(UUID userId, Long challengeId) {
        User user = new User();
        user.setId(userId);

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

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

        // 🔥 참가자가 0명이면 챌린지 자동 삭제
        if (challenge.getParticipantCount() == 0) {
            challengeRepository.delete(challenge);
        }
    }

    // ✅ 좋아요(Toggle) 기능
    public void toggleLike(UUID userId, Long challengeId) {
        User user = new User();
        user.setId(userId);

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

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
                }
        );
    }

    // ✅ 내가 참여한 챌린지 목록 조회 (태그 개수 & 현재 연속 도전 포함)
    public List<ChallengeMyListResponseDto> getParticipatedChallenges(UUID userId) {
        User user = new User();
        user.setId(userId);

        return userChallengeRepository.findByUser(user).stream()
                .map(UserChallenge::getChallenge) // UserChallenge에서 Challenge 가져오기
                .sorted((c1, c2) -> c2.getRegisterDate().compareTo(c1.getRegisterDate())) // 최신순 정렬
                .map(challenge -> {
                    // ✅ 해당 챌린지에서 사용자의 최신 기록 조회
                    Optional<Records> record = recordsRepository.findTopByUserAndChallengeOrderByStartDateDesc(user, challenge);

                    int currentStreak = record.map(Records::getCurrentStreak).orElse(0);
                    int tagCount = challenge.getTags() != null ? challenge.getTags().size() : 0; // ✅ 태그 개수 계산

                    return new ChallengeMyListResponseDto(
                            challenge.getId(),
                            challenge.getTitle(),
                            challenge.getImage(),
                            challenge.getRegisterDate(),
                            challenge.getTags(), // ✅ 태그 추가
                            tagCount, // ✅ 태그 개수 추가
                            currentStreak // ✅ 현재 연속 도전 일수 추가
                    );
                })
                .collect(Collectors.toList());
    }



    // ✅ 챌린지 검색 기능
    public List<ChallengeListResponseDto> searchChallenges(String keyword) {
        return challengeRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .sorted((c1, c2) -> c2.getRegisterDate().compareTo(c1.getRegisterDate())) // 최신순 정렬
                .map(ch -> new ChallengeListResponseDto(
                        ch.getId(), ch.getTitle(), ch.getDescription(), ch.getImage(), ch.getRegisterDate(), ch.getLikes(), ch.getViews(), ch.getParticipantCount()
                ))
                .collect(Collectors.toList());
    }

    // ✅ 챌린지 수정 (Owner만 가능)
    public ChallengeResponseDto updateChallenge(Long challengeId, ChallengeUpdateRequestDto updateDto, MultipartFile image) throws IOException {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        // ✅ Owner 검증
        if (!challenge.getOwner().getId().equals(updateDto.getOwnerId())) {
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

        // ✅ 이미지 수정 (새로운 이미지가 있을 경우 저장)
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            challenge.setImage(imageUrl);
        }

        // ✅ 저장 후 DTO 변환
        challengeRepository.save(challenge);
        return mapToDto(challenge);
    }

    // ✅ 챌린지 참여자 조회 (총 참여자 수 & 참여자 ID 리스트 반환)
    public ChallengeParticipantsResponseDto getChallengeParticipants(Long challengeId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("챌린지를 찾을 수 없습니다."));

        List<UUID> participantIds = userChallengeRepository.findByChallenge(challenge)
                .stream()
                .map(userChallenge -> userChallenge.getUser().getId()) // ✅ 유저 ID 리스트 추출
                .collect(Collectors.toList());

        return new ChallengeParticipantsResponseDto(
                challenge.getId(),
                participantIds.size(), // ✅ 총 참여자 수
                participantIds // ✅ 참여자 UUID 목록
        );
    }



    // 🆕 mapToDto 추가: Challenge -> ChallengeResponseDto 변환
    private ChallengeResponseDto mapToDto(Challenge challenge) {
        return new ChallengeResponseDto(
                challenge.getId(),
                challenge.getTitle(),
                challenge.getDescription(),
                challenge.getImage(),
                challenge.getRegisterDate(),
                challenge.getStartDate(),
                challenge.getEndDate(),
                challenge.getTags(),
                challenge.getLikes(),
                challenge.getViews(),
                challenge.getParticipantCount(),
                challenge.getOwner().getId() // ownerId 추가
        );
    }
}

