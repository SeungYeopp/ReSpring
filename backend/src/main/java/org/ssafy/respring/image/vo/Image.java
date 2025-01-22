package org.ssafy.respring.image.vo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "image")
public class Image {
    @Id
    private Long imageId;

    private String imageUrl;
}
