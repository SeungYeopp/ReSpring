package org.ssafy.respring.image.vo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "post_image")
@IdClass(PostImageId.class)
public class PostImage {
    @Id
    private Long id;

    @Id
    private Long imageId;
}
