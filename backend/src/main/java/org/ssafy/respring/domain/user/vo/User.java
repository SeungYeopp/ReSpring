package org.ssafy.respring.domain.user.vo;

import com.fasterxml.jackson.annotation.*;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.UserChallenge;
import org.ssafy.respring.domain.chat.vo.ChatMessage;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "user")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Hibernate Proxy 필드 직렬화 방지
@JsonInclude(JsonInclude.Include.NON_NULL) //  NULL 필드 직렬화 방지 (Redis 캐싱 최적화)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "BINARY(16)")
    @JsonProperty("userId") // Elasticsearch의 "userId"와 매핑
    @JsonAlias("id")
    private UUID id;

    private String userNickname;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    private String email;
    private String password;
    private String profileImage;
    private String provider;

    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Challenge> createdChallenges;

    @OneToMany(mappedBy = "author", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Book> myBooks;

    public User(String userNickname, String email, String password, String profileImage, String provider) {
        this.userNickname = userNickname;
        this.email = email;
        this.password = password;
        this.profileImage = profileImage;
        this.provider = provider;
    }



    public void changePassword(String encryptedPassword) {
        this.password = encryptedPassword;
    }
}
