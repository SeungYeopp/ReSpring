package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.challenge.vo.Records;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.domain.challenge.vo.Challenge;

import java.time.LocalDate;
import java.util.Optional;

public interface RecordsRepository extends JpaRepository<Records, Long> {
    Optional<Records> findByUserAndChallengeAndStartDateAndEndDate(User user, Challenge challenge, LocalDate startDate, LocalDate endDate);
    Optional<Records> findTopByUserAndChallengeOrderByStartDateDesc(User user, Challenge challenge);
}
