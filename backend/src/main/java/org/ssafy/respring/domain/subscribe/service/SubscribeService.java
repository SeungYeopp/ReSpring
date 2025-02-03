package org.ssafy.respring.domain.subscribe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.challenge.dto.response.ChallengeListResponseDto;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.image.dto.response.ImageResponseDTO;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.post.repository.PostRepository;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedChallengeResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedPostResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedUserResponseDto;
import org.ssafy.respring.domain.subscribe.repository.SubscribeRepository;
import org.ssafy.respring.domain.subscribe.vo.Subscribe;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SubscribeService {
    private final SubscribeRepository subscribeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ChallengeRepository challengeRepository;

    // ✅ 구독 기능 추가 (사용자 구독)
    public void subscribeUser(UUID subscriberId, UUID subscribedToId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 구독하는 사용자를 찾을 수 없습니다."));
        User subscribedTo = userRepository.findById(subscribedToId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 구독 대상 사용자를 찾을 수 없습니다."));

        // 중복 구독 방지
        if (subscribeRepository.existsBySubscriberAndSubscribedTo(subscriber, subscribedTo)) {
            throw new IllegalStateException("❌ 이미 구독한 사용자입니다.");
        }

        Subscribe subscription = Subscribe.builder()
                .subscriber(subscriber)
                .subscribedTo(subscribedTo)
                .build();

        subscribeRepository.save(subscription);
    }

    // ✅ 구독 취소 기능
    public void unsubscribeUser(UUID subscriberId, UUID subscribedToId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 구독하는 사용자를 찾을 수 없습니다."));
        User subscribedTo = userRepository.findById(subscribedToId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 구독 대상 사용자를 찾을 수 없습니다."));

        if (!subscribeRepository.existsBySubscriberAndSubscribedTo(subscriber, subscribedTo)) {
            throw new IllegalStateException("❌ 구독하지 않은 사용자입니다.");
        }

        subscribeRepository.deleteBySubscriberAndSubscribedTo(subscriber, subscribedTo);
    }

    // ✅ 내가 구독한 사용자의 게시글 조회
    public List<SubscribedPostResponseDto> getSubscribedUsersPosts(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        List<User> subscribedUsers = subscribeRepository.findBySubscriber(user).stream()
                .map(Subscribe::getSubscribedTo)
                .collect(Collectors.toList());

        return postRepository.findByUserIn(subscribedUsers).stream()
                .map(post -> new SubscribedPostResponseDto(
                        post.getId(),
                        post.getTitle(),
                        post.getContent(),
                        post.getCategory(),
                        post.getCreatedAt(),
                        post.getUpdatedAt(),
                        post.getLikes(),
                        post.getImages().stream()
                                .map(image -> new ImageResponseDTO(image.getImageId(), image.getImageUrl()))
                                .collect(Collectors.toList()),
                        post.getComments().size(),
                        post.getComments().stream()
                                .map(comment -> new CommentResponseDto(
                                        comment.getId(),
                                        comment.getContent(),
                                        comment.getUser().getUserNickname(),
                                        comment.getCreatedAt(),
                                        comment.getUpdatedAt(),
                                        comment.getParent() != null ? comment.getParent().getId() : null
                                ))
                                .collect(Collectors.toList()),
                        post.getUser().getId(),
                        post.getUser().getUserNickname()
                ))
                .collect(Collectors.toList());
    }

    // ✅ 내가 구독한 사용자의 챌린지 조회
    public List<SubscribedChallengeResponseDto> getSubscribedUsersChallenges(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        List<User> subscribedUsers = subscribeRepository.findBySubscriber(user).stream()
                .map(Subscribe::getSubscribedTo)
                .collect(Collectors.toList());

        return challengeRepository.findByOwnerIn(subscribedUsers).stream()
                .map(challenge -> new SubscribedChallengeResponseDto(
                        challenge.getId(),
                        challenge.getTitle(),
                        challenge.getDescription(),
                        challenge.getImage(),
                        challenge.getRegisterDate(),
                        challenge.getLikes(),
                        challenge.getViews(),
                        challenge.getParticipantCount(),
                        challenge.getOwner().getId(),
                        challenge.getOwner().getUserNickname()
                ))
                .collect(Collectors.toList());
    }

    // ✅ 내가 구독한 사용자 전체 조회
    public List<SubscribedUserResponseDto> getSubscribedUsers(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        return subscribeRepository.findBySubscriber(user).stream()
                .map(Subscribe::getSubscribedTo)
                .map(subscribedUser -> new SubscribedUserResponseDto(
                        subscribedUser.getId(),
                        subscribedUser.getUserNickname(),
                        subscribedUser.getEmail(),
                        subscribedUser.getProfileImage(),
                        subscribedUser.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}