package org.ssafy.respring.domain.book.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "book")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    private String title;

//    @Column(columnDefinition = "TEXT")
//    private String content;

    private Set<String> tags;

    @Column(name = "cover_image")
    private String coverImage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BookLikes> bookLikes = new HashSet<>();

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<BookViews> views = new HashSet<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "book_story", joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "story_id")
    @Builder.Default
    private List<Long> storyIds = new ArrayList<>();

    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Comment> comments = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
