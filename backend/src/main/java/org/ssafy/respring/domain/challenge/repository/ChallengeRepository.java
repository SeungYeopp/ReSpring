package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long>, ChallengeRepositoryQueryDsl {
    // ✅ 제목에 특정 키워드가 포함된 챌린지 검색 (대소문자 구분 없음)
    List<Challenge> findByTitleContainingIgnoreCase(String keyword);
    List<Challenge> findByOwnerIn(List<User> users); // ✅ 구독한 사용자의 챌린지 조회
    Optional<Challenge> findByChatRoomId(Long chatRoomId);
    List<Challenge> findByStartDateAfter(LocalDateTime now); // 시작 전 챌린지
    List<Challenge> findByStartDateBeforeAndEndDateAfter(LocalDateTime now1, LocalDateTime now2); // 진행 중 챌린지
    List<Challenge> findByEndDateBefore(LocalDateTime now); // 종료된 챌린지
}
