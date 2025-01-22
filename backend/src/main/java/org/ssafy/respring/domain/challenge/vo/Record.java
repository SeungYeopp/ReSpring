package org.ssafy.respring.domain.challenge.vo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "record")
@IdClass(RecordId.class)
public class Record {
    @Id
    private Long id;

    @Id
    private Long challengeId;

    @Id
    private byte[] userId;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;
}
