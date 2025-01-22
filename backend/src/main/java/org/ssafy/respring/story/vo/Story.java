package org.ssafy.respring.story.vo;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "story")
@IdClass(StoryId.class)
public class Story {
    @Id
    private Long id;

    @Id
    private Long eventId;

    @Id
    private byte[] userId;

    private String storyTitle;
    private String storyContent;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;
}
