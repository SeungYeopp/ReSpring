package org.ssafy.respring.domain.tag.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;

import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.tag.repository.TagRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Service
@RequiredArgsConstructor
public class TagRecommendationService {
    private final TagRepository tagRepository;
    private final RedisTemplate<String, List<Challenge>> challengeRedisTemplate;
    private final ObjectMapper objectMapper; // ObjectMapper 추가

    @Transactional
    public List<Challenge> recommendChallenges(UUID userId) {
        String cacheKey = "recommend:challenge:" + userId;

        // ✅ 1. Redis에서 캐싱된 데이터 확인
        Object cachedData = challengeRedisTemplate.opsForValue().get(cacheKey);
        if (cachedData instanceof List<?>) {
            List<?> cachedList = (List<?>) cachedData;

            if (!cachedList.isEmpty() && cachedList.get(0) instanceof LinkedHashMap) {
                objectMapper.registerModule(new JavaTimeModule());
                List<Challenge> deserializedList = cachedList.stream()
                  .map(item -> objectMapper.convertValue(item, Challenge.class))
                  .collect(Collectors.toList());

                System.out.println("🚀 Redis 캐시 HIT! 데이터 개수: " + deserializedList.size());
                return deserializedList;
            }
        }

        // ✅ 2. DB에서 챌린지 조회
        List<Challenge> recommendedChallenges = tagRepository.recommendChallenges(userId);
        System.out.println("🚀 DB에서 가져온 챌린지 개수: " + recommendedChallenges.size());

        // ✅ 3. Hibernate Proxy 초기화 (Lazy Loading 문제 해결)
        recommendedChallenges.forEach(challenge -> {
            Hibernate.initialize(challenge.getOwner());
            challenge.setOwner(
              User.builder()
                .id(challenge.getOwner().getId())
                .userNickname(challenge.getOwner().getUserNickname())
                .profileImage(challenge.getOwner().getProfileImage())
                .build()
            );
        });

        // ✅ 4. Redis 저장 전에 데이터 검증
        if (recommendedChallenges.isEmpty()) {
            System.out.println("🚨 DB에서 가져온 챌린지가 없음! Redis에 저장하지 않음.");
            return recommendedChallenges;
        }

        try {
            // ✅ 5. Redis에 데이터 저장 (확인용 로그 추가)
            challengeRedisTemplate.opsForValue().set(cacheKey, recommendedChallenges, Duration.ofHours(1));
            System.out.println("✅ Redis에 저장 완료: " + recommendedChallenges.size() + "개");

            // ✅ 6. 저장된 데이터가 실제로 존재하는지 다시 확인
            Object storedData = challengeRedisTemplate.opsForValue().get(cacheKey);
            if (storedData instanceof List<?>) {
                List<?> storedList = (List<?>) storedData;
                System.out.println("🚀 Redis에 저장된 챌린지 개수 (검증): " + storedList.size());
            }
        } catch (Exception e) {
            System.out.println("❌ Redis 저장 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }

        return recommendedChallenges;
    }
}
