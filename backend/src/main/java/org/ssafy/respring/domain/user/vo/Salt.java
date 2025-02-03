package org.ssafy.respring.domain.user.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

import java.util.UUID;

@Entity
@Table(name = "salt")
@Getter
public class Salt {

    @Id
    @Column(columnDefinition = "BINARY(16)")
    private UUID userId;
    private String salt;

    public Salt() {
    }

    public Salt(UUID userId, String salt) {
        super();
        this.userId = userId;
        this.salt = salt;
    }

}

