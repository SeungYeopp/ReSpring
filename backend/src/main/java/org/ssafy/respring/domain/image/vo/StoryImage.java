package org.ssafy.respring.domain.image.vo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;

@Entity
@Table(name = "story_image")
@IdClass(StoryImageId.class)
public class StoryImage {
    @Id
    private Long id;

    @Id
    private Long imageId;
}
