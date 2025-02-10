package org.ssafy.respring.domain.book.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BookViewsRedisService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String VIEW_COUNT_PREFIX = "book:view:";

    // 조회수 증가
    public void incrementViewCount(Long bookId) {
        String redisKey = VIEW_COUNT_PREFIX + bookId;
        redisTemplate.opsForValue().increment(redisKey);
        redisTemplate.expire(redisKey, 1, TimeUnit.DAYS); // TTL 설정 (1일)
    }

    // 조회수 가져오기
    public Long getViewCount(Long bookId) {
        String redisKey = VIEW_COUNT_PREFIX + bookId;
        Object value = redisTemplate.opsForValue().get(redisKey);
        return value != null ? Long.parseLong(value.toString()) : 0L;
    }

    // MySQL 반영 후 삭제
    public void removeViewCount(Long bookId) {
        String redisKey = VIEW_COUNT_PREFIX + bookId;
        redisTemplate.delete(redisKey);
    }
}
