package org.ssafy.respring.domain.subscribe.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.book.repository.BookRepository;
import org.ssafy.respring.domain.book.service.BookLikesRedisService;
import org.ssafy.respring.domain.book.service.BookViewsRedisService;
import org.ssafy.respring.domain.challenge.repository.ChallengeRepository;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.image.vo.ImageType;
import org.ssafy.respring.domain.notification.service.NotificationService;
import org.ssafy.respring.domain.notification.vo.TargetType;
import org.ssafy.respring.domain.post.repository.PostRepository;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedBookResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedChallengeResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedPostResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedUserResponseDto;
import org.ssafy.respring.domain.subscribe.repository.SubscribeRepository;
import org.ssafy.respring.domain.subscribe.vo.Subscribe;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.domain.notification.vo.NotificationType;

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
    private final BookRepository bookRepository;
    private final ImageService imageService;

    private final BookLikesRedisService bookLikesRedisService;
    private final BookViewsRedisService bookViewsRedisService;
    private final NotificationService notificationService; // ✅ 알림 서비스 추가

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

// ✅ 구독된 사용자(subscribedToId)에게 알림 전송 (구독한 사용자 ID 포함)
        notificationService.sendNotification(
                subscribedToId, // ✅ receiverId (구독된 사용자)
                subscriberId, // ✅ initiatorId (구독한 사용자)
                NotificationType.FOLLOW,
                TargetType.USER,
                subscription.getId(),
                subscriber.getUserNickname() + "님이 당신을 구독했습니다!"
        );
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
                .map(post -> {
                    List<String> images = imageService.getImagesByEntity(ImageType.POST, post.getId());

                    return new SubscribedPostResponseDto(
                            post.getId(),
                            post.getTitle(),
                            post.getContent(),
                            post.getCategory(),
                            post.getCreatedAt(),
                            post.getUpdatedAt(),
                            post.getLikes(),
                            images,
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
                    );
                })
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
                .map(challenge -> {
                    String image = imageService.getSingleImageByEntity(ImageType.CHALLENGE, challenge.getId());

                    return new SubscribedChallengeResponseDto(
                            challenge.getId(),
                            challenge.getTitle(),
                            challenge.getDescription(),
                            image,
                            challenge.getRegisterDate(),
                            challenge.getLikes(),
                            challenge.getViews(),
                            challenge.getParticipantCount(),
                            challenge.getOwner().getId(),
                            challenge.getOwner().getUserNickname()
                    );
                })
                .collect(Collectors.toList());
    }

    // ✅ 내가 구독한 사용자의 봄날의 서 조회
    public List<SubscribedBookResponseDto> getSubscribedUsersBooks(UUID userId) {
        User user = userRepository.findById(userId)
          .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        // 구독한 사용자 목록 가져오기
        List<User> subscribedUsers = subscribeRepository.findBySubscriber(user).stream()
          .map(Subscribe::getSubscribedTo)
          .collect(Collectors.toList());

        // 구독한 사용자가 작성한 책 조회 후 DTO 변환
        return bookRepository.findByAuthorIn(subscribedUsers).stream()
          .map(book -> SubscribedBookResponseDto.builder()
            .id(book.getId())
            .title(book.getTitle())
            .coverImage(book.getCoverImage())
            .tags(book.getTags())
            .isLiked(bookLikesRedisService.isLiked(book.getId(), userId)) // ✅ 좋아요 여부
            .likeCount(bookLikesRedisService.getLikeCount(book.getId())) // ✅ 좋아요 수
            .viewCount(bookViewsRedisService.getViewCount(book.getId())) // ✅ 조회 수
            .likedUsers(bookLikesRedisService.getLikedUsers(book.getId())) // ✅ 좋아요 누른 사용자 목록
            .createdAt(book.getCreatedAt())
            .updatedAt(book.getUpdatedAt())
            .authorNickname(book.getAuthor().getUserNickname()) // ✅ 작성자 이름
            .authorProfileImage(book.getAuthor().getProfileImage())
            .build())
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

    // ✅ 내가 특정 사용자를 구독했는지 여부 확인
    public boolean isSubscribed(UUID subscriberId, UUID subscribedToId) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 구독하는 사용자를 찾을 수 없습니다."));
        User subscribedTo = userRepository.findById(subscribedToId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 구독 대상 사용자를 찾을 수 없습니다."));

        return subscribeRepository.existsBySubscriberAndSubscribedTo(subscriber, subscribedTo);
    }

}