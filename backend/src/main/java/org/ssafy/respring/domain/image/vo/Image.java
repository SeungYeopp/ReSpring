package org.ssafy.respring.domain.image.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.post.vo.Post;

@Entity
@Table(name = "image")
@Getter @Setter
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long imageId;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    @PrePersist
    @PreUpdate
    public void validateAssociations() {
        if (post != null && book != null) {
            throw new IllegalStateException("An image cannot be associated with both a post and a book.");
        }
    }

}
