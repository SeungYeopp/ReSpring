package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.vo.Records;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    // ✅ 챌린지 성공 여부 기록 (날짜 변경 시 isSuccess 초기화)
    public void recordChallenge(UUID userId, Long challengeId, boolean isSuccess) {
        // 🔹 User 엔티티 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));

        LocalDate today = LocalDate.now();
        LocalDate startDate = challenge.getStartDate().toLocalDate();
        LocalDate endDate = challenge.getEndDate().toLocalDate();

        // ✅ 챌린지가 시작 전이면 기록 불가
        if (today.isBefore(startDate)) {
            throw new IllegalStateException("챌린지가 아직 시작되지 않았습니다.");
        }

        // ✅ 챌린지가 종료 후이면 기록 불가
        if (today.isAfter(endDate)) {
            throw new IllegalStateException("챌린지가 이미 종료되었습니다.");
        }

        // ✅ 기존 기록 가져오기 (recordStartDate를 기준으로 최신 데이터 조회)
        Optional<Records> existingRecordOpt = recordsRepository.findTopByUserAndChallengeOrderByRecordStartDateDesc(user, challenge);

        if (existingRecordOpt.isPresent()) {
            Records record = existingRecordOpt.get();

            // ✅ 어제 기록이 false였고 오늘 true이면 새로운 record 생성
            if (!record.isSuccess() && isSuccess) {
                // 🔥 새로운 기록 생성
                Records newRecord = Records.builder()
                        .user(user)
                        .challenge(challenge)
                        .recordStartDate(today) // ✅ 새로운 시작 날짜 설정
                        .lastUpdatedDate(today)
                        .startDate(startDate)
                        .endDate(endDate)
                        .successCount(1)
                        .totalDays((int) (endDate.toEpochDay() - startDate.toEpochDay() + 1))
                        .currentStreak(1)
                        .longestStreak(1)
                        .isSuccess(true)
                        .build();

                recordsRepository.save(newRecord);
            } else {
                // ✅ 기존 기록 업데이트
                if (!record.getLastUpdatedDate().equals(today)) {
                    record.setIsSuccess(false); // ✅ 하루 지나면 초기화
                }

                if (isSuccess) {
                    record.setSuccessCount(record.getSuccessCount() + 1);
                    record.setCurrentStreak(record.getCurrentStreak() + 1);
                    record.setLongestStreak(Math.max(record.getLongestStreak(), record.getCurrentStreak()));
                    record.setIsSuccess(true);
                }

                record.setLastUpdatedDate(today);
                recordsRepository.save(record);
            }
        } else {
            // ✅ 기존 기록이 없으면 새 기록 생성
            Records newRecord = Records.builder()
                    .user(user)
                    .challenge(challenge)
                    .recordStartDate(today) // ✅ 새로운 시작 날짜 설정
                    .lastUpdatedDate(today)
                    .startDate(startDate)
                    .endDate(endDate)
                    .successCount(isSuccess ? 1 : 0)
                    .totalDays((int) (endDate.toEpochDay() - startDate.toEpochDay() + 1))
                    .currentStreak(isSuccess ? 1 : 0)
                    .longestStreak(isSuccess ? 1 : 0)
                    .isSuccess(isSuccess)
                    .build();

            recordsRepository.save(newRecord);
        }
    }

}