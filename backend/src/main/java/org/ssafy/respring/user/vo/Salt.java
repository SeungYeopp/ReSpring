package org.ssafy.respring.user.vo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "salt")
public class Salt {
    @Id
    private byte[] id;

    @Column(name = "Salt")
    private String salt;
}
