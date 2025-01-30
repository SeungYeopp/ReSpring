package org.ssafy.respring.domain.book.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Document(collection = "book")
@Getter @Setter
public class Book {
    @Id
    private String id; // MongoDB는 기본적으로 String ID 사용

    @DBRef
    private User user;

    private String title;
    private String content;
    private String coverImg;
    private String tag;
    private Long likes;
    private Long view;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
