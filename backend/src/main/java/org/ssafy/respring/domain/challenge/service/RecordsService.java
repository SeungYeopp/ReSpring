package org.ssafy.respring.domain.challenge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.challenge.repository.RecordsRepository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.Records;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class RecordsService {
    private final RecordsRepository recordsRepository;
    private final ChallengeRepository challengeRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordChallenge(UUID userId, Long challengeId, boolean isSuccess) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 챌린지를 찾을 수 없습니다. ID: " + challengeId));

        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        //   기존 기록 가져오기
        Optional<Records> existingRecordOpt = recordsRepository.findTopByUserAndChallengeOrderByLastUpdatedDateDesc(user, challenge);

        if (existingRecordOpt.isPresent()) {
            Records record = existingRecordOpt.get();

            //   last_updated_date가 어제라면 기존 row 업데이트
            if (record.getLastUpdatedDate().equals(yesterday)) {
                record.setIsSuccess(true);
                record.setLastUpdatedDate(today);
                recordsRepository.save(record);
            } else {
                //   last_updated_date가 어제가 아니면 새로운 row 생성
                Records newRecord = Records.builder()
                        .user(user)
                        .challenge(challenge)
                        .recordStartDate(today)
                        .lastUpdatedDate(today)
                        .startDate(challenge.getStartDate().toLocalDate())
                        .endDate(challenge.getEndDate().toLocalDate())
                        .isSuccess(true)  // 버튼을 눌렀기 때문에 SUCCESS로 설정
                        .successCount(1)
                        .totalDays((int) (challenge.getEndDate().toLocalDate().toEpochDay() - challenge.getStartDate().toLocalDate().toEpochDay() + 1))
                        .currentStreak(1)
                        .longestStreak(1)
                        .build();
                recordsRepository.save(newRecord);
            }
        } else {
            //   기존 기록이 없으면 새로운 row 생성
            Records newRecord = Records.builder()
                    .user(user)
                    .challenge(challenge)
                    .recordStartDate(today)
                    .lastUpdatedDate(today)
                    .startDate(challenge.getStartDate().toLocalDate())
                    .endDate(challenge.getEndDate().toLocalDate())
                    .isSuccess(true) // 버튼을 눌렀기 때문에 SUCCESS로 설정
                    .successCount(1)
                    .totalDays((int) (challenge.getEndDate().toLocalDate().toEpochDay() - challenge.getStartDate().toLocalDate().toEpochDay() + 1))
                    .currentStreak(1)
                    .longestStreak(1)
                    .build();
            recordsRepository.save(newRecord);
        }
    }

    public Map<String, String> getChallengeRecords(UUID userId, Long challengeId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 챌린지를 찾을 수 없습니다. ID: " + challengeId));

        LocalDate startDate = challenge.getStartDate().toLocalDate();
        LocalDate today = LocalDate.now();
        Map<String, String> records = new LinkedHashMap<>();

        //   기본적으로 start_date부터 오늘까지 FAIL로 설정
        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            records.put(date.toString(), "FAIL");
        }

        //   DB에서 기록 가져오기
        List<Records> recordsList = recordsRepository.findByUserAndChallengeOrderByLastUpdatedDateAsc(user, challenge);

        for (Records record : recordsList) {
            LocalDate recordStart = record.getRecordStartDate();
            LocalDate lastUpdated = record.getLastUpdatedDate();

            //   record_start_date ~ last_updated_date 범위를 SUCCESS로 설정
            for (LocalDate date = recordStart; !date.isAfter(lastUpdated); date = date.plusDays(1)) {
                records.put(date.toString(), "SUCCESS");
            }
        }

        return records;
    }


}