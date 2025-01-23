package org.ssafy.respring.domain.story.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.respring.domain.image.vo.Image;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "story")
//@IdClass(StoryId.class)
@Getter @Setter
public class Story {
    @Id
    private Long id;

//    @Id
//    private Long eventId;
//
//    @Id
//    private byte[] userId;

    private String storyTitle;
    private String storyContent;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "modified_at")
    private LocalDateTime modifiedAt;

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();
}
