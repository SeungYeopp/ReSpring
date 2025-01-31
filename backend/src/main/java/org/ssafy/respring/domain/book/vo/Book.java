package org.ssafy.respring.domain.book.vo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.ssafy.respring.domain.image.vo.Image;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "book")
@Getter @Setter
public class Book {
    @Id
    private String id; // MongoDB는 기본적으로 ObjectId 사용
    private UUID userId;
    private String title;
    private String content;
    private String coverImg;
    private List<String> tag;
    private Long likes;
    private Long view;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<Long> storyIds; // MySQL에서 관리되는 Story ID 리스트

}
