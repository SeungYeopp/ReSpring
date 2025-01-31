package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.MonthlyRecords;

import java.util.List;
import java.util.UUID;

@Repository
public interface MonthlyRecordsRepository extends JpaRepository<MonthlyRecords, Long> {
    List<MonthlyRecords> findByUserId(UUID userId);
}
