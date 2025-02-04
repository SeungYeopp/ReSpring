package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    // ✅ 제목에 특정 키워드가 포함된 챌린지 검색 (대소문자 구분 없음)
    List<Challenge> findByTitleContainingIgnoreCase(String keyword);
    List<Challenge> findByOwnerIn(List<User> users); // ✅ 구독한 사용자의 챌린지 조회
}
