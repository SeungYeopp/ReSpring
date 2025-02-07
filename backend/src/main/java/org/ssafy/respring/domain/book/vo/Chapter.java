package org.ssafy.respring.domain.book.vo;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chapter")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id", nullable = false)
    private Long bookId;

    @Column(name = "chapter_title", nullable = false)
    private String chapterTitle;

    @Column(name = "chapter_content", nullable = false)
    private String chapterContent;

    private int chapterOrder;
}
