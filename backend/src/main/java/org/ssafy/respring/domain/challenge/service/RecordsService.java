package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.vo.Records;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class RecordsService {
    private final RecordsRepository recordsRepository;
    private final ChallengeRepository challengeRepository;

    // ✅ 챌린지 성공 여부 기록 (날짜 변경 시 isSuccess 초기화)
    public void recordChallenge(UUID userId, Long challengeId, boolean isSuccess) {
        User user = new User();
        user.setId(userId);

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        LocalDate today = LocalDate.now();
        LocalDate startDate = challenge.getStartDate().toLocalDate();
        LocalDate endDate = challenge.getEndDate().toLocalDate();

        Optional<Records> existingRecord = recordsRepository.findByUserAndChallengeAndStartDateAndEndDate(
                user, challenge, startDate, endDate);

        if (existingRecord.isPresent()) {
            // ✅ 기존 기록이 있는 경우
            Records record = existingRecord.get();

            // ✅ 날짜가 변경되었으면 isSuccess 초기화
            if (!record.getLastUpdatedDate().equals(today)) {
                record.setIsSuccess(false);
                record.setLastUpdatedDate(today);
            }

            if (!record.isSuccess() && isSuccess) {
                // ✅ 실패에서 성공으로 변경 가능
                record.setSuccessCount(record.getSuccessCount() + 1);
                record.setCurrentStreak(record.getCurrentStreak() + 1);
                record.setLongestStreak(Math.max(record.getLongestStreak(), record.getCurrentStreak()));
                record.setIsSuccess(true); // ✅ 오늘 성공 여부 true
                record.setLastUpdatedDate(today); // ✅ 마지막 업데이트 날짜 변경
            } else if (record.isSuccess() && !isSuccess) {
                // ❌ 이미 성공한 경우 실패로 변경 불가
                throw new IllegalStateException("이미 성공한 기록은 실패로 변경할 수 없습니다.");
            }
        } else {
            // ✅ 기존 기록이 없으면 새 기록 생성
            Records newRecord = Records.builder()
                    .user(user)
                    .challenge(challenge)
                    .startDate(startDate)
                    .endDate(endDate)
                    .successCount(isSuccess ? 1 : 0)
                    .totalDays((int) (endDate.toEpochDay() - startDate.toEpochDay() + 1))
                    .currentStreak(isSuccess ? 1 : 0)
                    .longestStreak(isSuccess ? 1 : 0)
                    .recordKey(UUID.randomUUID())
                    .isSuccess(isSuccess) // ✅ 성공 여부 저장
                    .lastUpdatedDate(today) // ✅ 오늘 날짜 저장
                    .build();

            recordsRepository.save(newRecord);
        }
    }
}