package org.ssafy.respring.domain.image.vo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.story.vo.Story;

@Entity
@Table(name = "image")
@Getter @Setter
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

