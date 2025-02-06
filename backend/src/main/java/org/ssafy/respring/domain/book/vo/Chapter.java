package org.ssafy.respring.domain.book.vo;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chapter")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    private String chapterTitle;

    @Column(columnDefinition = "TEXT")
    private String chapterContent; // JSON 형태로 저장
}
