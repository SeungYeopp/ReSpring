package org.ssafy.respring.domain.tag.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.tag.repository.TagRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TagRecommendationService {

    private final TagRepository tagRepository;
    private final RedisTemplate<String, List<Challenge>> challengeRedisTemplate;
    private final RedisTemplate<String, List<Book>> bookRedisTemplate;

    /**
     * 태그 기반 챌린지 추천 (Redis 캐싱 적용)
     */
    @Transactional
    public List<Challenge> recommendChallenges(UUID userId) {
        String cacheKey = "recommend:challenge:" + userId;
        List<Challenge> cachedResult = challengeRedisTemplate.opsForValue().get(cacheKey);

        if (cachedResult == null) {
            cachedResult = tagRepository.recommendChallenges(userId);
            challengeRedisTemplate.opsForValue().set(cacheKey, cachedResult, Duration.ofHours(1));
        }

        return cachedResult;
    }
}
