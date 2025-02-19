package org.ssafy.respring.domain.book.vo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.LinkedHashMap;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "book_content") //   MongoDB 컬렉션명 지정
public class BookContent {
    @Id
    private String id; // MongoDB의 기본 ID
    private Long bookId; // MySQL book 테이블과 매칭될 ID
    private LinkedHashMap<String, String> content; //   JSON 형태로 저장할 content (chapterTitle: chapterContent)
}