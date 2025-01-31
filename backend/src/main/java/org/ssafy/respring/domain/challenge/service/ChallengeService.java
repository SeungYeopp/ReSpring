package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.Records;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ChallengeService {
    private final ChallengeRepository challengeRepository;
    private final RecordsRepository recordsRepository;

    public Challenge createChallenge(Challenge challenge, UUID userId) {
        challenge.setOwnerId(userId);
        return challengeRepository.save(challenge);
    }

    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    public Optional<Challenge> getChallengeById(Long id) {
        challengeRepository.findById(id).ifPresent(challenge -> {
            challenge.setViews(challenge.getViews() + 1);
            challengeRepository.save(challenge);
        });
        return challengeRepository.findById(id);
    }

    public void deleteChallenge(Long id, UUID userId) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));
        if (!challenge.getOwnerId().equals(userId)) {
            throw new IllegalStateException("You can only delete your own challenges");
        }
        challengeRepository.deleteById(id);
    }

    public List<Records> getParticipants(Long challengeId) {
        return recordsRepository.findByChallengeId(challengeId);
    }

    public Records participateInChallenge(UUID userId, Long challengeId) {
        if (recordsRepository.existsByUserIdAndChallengeId(userId, challengeId)) {
            throw new IllegalStateException("Already participating");
        }
        Records records = Records.builder()
                .userId(userId)
                .challenge(Challenge.builder().id(challengeId).build())
                .startDate(LocalDate.now())
                .endDate(LocalDate.now())
                .build();
        return recordsRepository.save(records);
    }

//    @Transactional
//    public boolean toggleLike(Long challengeId, UUID userId) {
//        Challenge challenge = challengeRepository.findById(challengeId)
//                .orElseThrow(() -> new IllegalArgumentException("Challenge not found with id: " + challengeId));
//
//        boolean isLiked = challenge.toggleLike(userId); // 좋아요 토글
//        challenge.setLikes((long) challenge.getLikedUsers().size()); // 좋아요 수 업데이트
//        challengeRepository.save(challenge);
//        return isLiked;
//    }


}

