package org.ssafy.respring.domain.challenge.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"user", "challenge"})
public class Records {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    private Challenge challenge;

    private LocalDate startDate;
    private LocalDate endDate;

    private int successCount;   //   총 성공 횟수
    private int totalDays;      //   챌린지 총 일수

    private int longestStreak;  //   최대 연속 성공 일수
    private int currentStreak;  //   현재 연속 성공 일수 (최근)

    @Column(unique = true)
    private UUID recordKey;

    private boolean isSuccess; //   오늘 성공 여부 (하루가 지나면 자동으로 false)
    private LocalDate recordStartDate; //   새로운 기록이 시작된 날짜
    private LocalDate lastUpdatedDate; //   마지막 성공 여부 업데이트 날짜

    public void setIsSuccess(boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    @PrePersist
    public void generateRecordKey() {
        if (this.recordKey == null) {
            this.recordKey = UUID.randomUUID();
        }
    }
}
