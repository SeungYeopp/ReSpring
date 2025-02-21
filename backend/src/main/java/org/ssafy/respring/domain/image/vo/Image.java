package org.ssafy.respring.domain.image.vo;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    private String s3Key;

    @Enumerated(EnumType.STRING)
    private ImageType imageType;

    private Long entityId;
}

