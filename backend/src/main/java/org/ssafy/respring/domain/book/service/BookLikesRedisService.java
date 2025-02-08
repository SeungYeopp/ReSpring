package org.ssafy.respring.domain.book.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookLikesRedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String LIKE_KEY_PREFIX = "book:likes:";

    public void addLike(Long bookId, UUID userId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        redisTemplate.opsForSet().add(redisKey, userId.toString());
        redisTemplate.expire(redisKey, 1, TimeUnit.DAYS);
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

    public Set<UUID> getLikedUsers(Long bookId) {
        String redisKey = LIKE_KEY_PREFIX + bookId;
        Set<Object> likedUsers = redisTemplate.opsForSet().members(redisKey);
        if (likedUsers == null) {
            return Set.of();
        }
        return likedUsers.stream()
          .map(Object::toString)
          .map(UUID::fromString)
          .collect(Collectors.toSet());
    }
}
