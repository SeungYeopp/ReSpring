package org.ssafy.respring.domain.tag.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.challenge.dto.response.ChallengeListResponseDto;
import org.ssafy.respring.domain.challenge.service.ChallengeService;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.tag.repository.ChallengeTagRepository;
import org.ssafy.respring.domain.tag.repository.TagRepository;
import org.ssafy.respring.domain.tag.vo.ChallengeTag;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagRecommendationService {
    private final TagRepository tagRepository;
    private final RedisTemplate<String, String> challengeRedisTemplate;

    private final ChallengeTagRepository challengeTagRepository;
    private final ImageService imageService;
    private final ChallengeService challengeService;
    private final ObjectMapper objectMapper;

    @Transactional
    public List<ChallengeListResponseDto> recommendChallenges(UUID userId) {
        String cacheKey = "recommend:challenge:" + userId;

        //   1. Redis에서 캐싱된 데이터 확인
        String cachedJson = challengeRedisTemplate.opsForValue().get(cacheKey);
        if (cachedJson != null) {
            try {
                List<ChallengeListResponseDto> cachedChallenges = objectMapper.readValue(
                        cachedJson, new TypeReference<List<ChallengeListResponseDto>>() {}
                );
                return cachedChallenges;
            } catch (Exception e) {
                System.err.println("❌ Redis 캐싱 데이터 변환 오류: " + e.getMessage());
            }
        }


        //   2. DB에서 챌린지 조회
        List<Challenge> recommendedChallenges = tagRepository.recommendChallenges(userId);

        //   3. DTO 변환
        List<ChallengeListResponseDto> dtoList = recommendedChallenges.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        //   4. Redis에 JSON 문자열로 저장
        try {
            String jsonValue = objectMapper.writeValueAsString(dtoList);
            challengeRedisTemplate.opsForValue().set(cacheKey, jsonValue, 1, TimeUnit.HOURS);
        } catch (Exception e) {
            System.err.println("Redis 저장 중 JSON 변환 오류: " + e.getMessage());
        }

        return dtoList;
    }

    private ChallengeListResponseDto mapToDto(Challenge challenge) {
        String imageUrl = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());

        List<ChallengeTag> challengeTags = challengeTagRepository.findByChallengeId(challenge.getId());

        Set<Tag> tags = challengeTags.stream()
                .map(ChallengeTag::getTag)
                .collect(Collectors.toSet());

        return ChallengeListResponseDto.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .image(imageUrl)
                .registerDate(challenge.getRegisterDate())
                .tags(tags)
                .likes(challenge.getLikes())
                .views(challenge.getViews())
                .participantCount(challenge.getParticipantCount())
                .status(challengeService.getChallengeStatus(challenge))
                .build();
    }
}
