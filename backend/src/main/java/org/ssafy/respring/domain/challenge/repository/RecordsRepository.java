package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.Records;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RecordsRepository extends JpaRepository<Records, Long> {
    Optional<Records> findByUserAndChallengeAndStartDateAndEndDate(User user, Challenge challenge, LocalDate startDate, LocalDate endDate);
    Optional<Records> findTopByUserAndChallengeOrderByStartDateDesc(User user, Challenge challenge);
    Optional<Records> findTopByUserAndChallengeOrderByRecordStartDateDesc(User user, Challenge challenge);
    List<Records> findByUserAndChallengeOrderByLastUpdatedDateAsc(User user, Challenge challenge);
    // ✅ 올바른 쿼리 방식으로 변경 (Challenge는 엔티티로 비교)
    Optional<Records> findTopByUserAndChallengeOrderByLastUpdatedDateDesc(User user, Challenge challenge);

    @Modifying
    @Transactional
    @Query("UPDATE Records r SET r.isSuccess = false WHERE r.isSuccess = true")
    void resetIsSuccess();
}
