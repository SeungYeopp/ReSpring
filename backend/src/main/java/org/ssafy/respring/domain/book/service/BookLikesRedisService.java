package org.ssafy.respring.domain.book.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.book.repository.BookRepository;
import org.ssafy.respring.domain.book.repository.info.BookLikesRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.BookLikes;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookLikesRedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final BookLikesRepository bookLikesRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private static final String LIKE_KEY_PREFIX = "book:likes:";

    public void addLike(Long bookId, UUID userId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        redisTemplate.opsForSet().add(redisKey, userId.toString());

        // 기존 TTL이 있으면 유지, 없으면 설정
        if (Boolean.FALSE.equals(redisTemplate.hasKey(redisKey))) {
            redisTemplate.expire(redisKey, 1, TimeUnit.DAYS);
        }
    }

    public void removeLike(Long bookId, UUID userId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        redisTemplate.opsForSet().remove(redisKey, userId.toString());
    }

    public boolean isLiked(Long bookId, UUID userId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(redisKey, userId.toString()));
    }

    public Long getLikeCount(Long bookId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        return redisTemplate.opsForSet().size(redisKey);
    }

    public void removeLikeCache(Long bookId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        redisTemplate.delete(redisKey);
    }

    @Scheduled(fixedRate = 3600000) // 1시간마다 실행
    public void syncLikesWithMySQL() {
        Set<String> keys = redisTemplate.keys(LIKE_KEY_PREFIX + "*");
        if (keys == null) return;

        for (String key : keys) {
            Long bookId = Long.parseLong(key.replace(LIKE_KEY_PREFIX, ""));
            Set<UUID> likedUsers = getLikedUsers(bookId);

            likedUsers.forEach(userId -> {
                Book book = bookRepository.findById(bookId).orElse(null);
                User user = userRepository.findById(userId).orElse(null);

                if (book != null && user != null) {
                    if (!bookLikesRepository.existsByBookAndUser(book, user)) { // 중복 방지
                        bookLikesRepository.save(BookLikes.builder()
                          .book(book)
                          .user(user)
                          .likedAt(LocalDateTime.now())
                          .build());
                    }
                }
            });

            // MySQL에 반영 후 Redis 데이터 삭제
            removeLikeCache(bookId);
        }
    }

    public Set<UUID> getLikedUsers(Long bookId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        return Optional.ofNullable(redisTemplate.opsForSet().members(redisKey))
          .orElse(Set.of())
          .stream()
          .map(Object::toString)
          .map(UUID::fromString)
          .collect(Collectors.toSet());
    }
}
