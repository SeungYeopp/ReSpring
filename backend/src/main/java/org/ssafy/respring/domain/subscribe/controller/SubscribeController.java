package org.ssafy.respring.domain.subscribe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedBookResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedChallengeResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedPostResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedUserResponseDto;
import org.ssafy.respring.domain.subscribe.service.SubscribeService;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscribe API", description = "사용자 구독 기능을 제공합니다.")
public class SubscribeController {

    private final SubscribeService subscribeService;
    private final UserService userService;

    @PostMapping("/{subscribedToNickname}")
    @Operation(summary = "사용자 구독", description = "특정 사용자를 구독합니다.")
    public ResponseEntity<Void> subscribeUser(@PathVariable String subscribedToNickname, HttpSession session) {
        UUID subscriberId = (UUID) session.getAttribute("userId");

        subscribeService.subscribeUser(subscriberId, userService.findByNickname(subscribedToNickname).getId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{subscribedToNickname}")
    @Operation(summary = "사용자 구독 취소", description = "특정 사용자의 구독을 취소합니다.")
    public ResponseEntity<Void> unsubscribeUser(@PathVariable String subscribedToNickname, HttpSession session) {
        UUID subscriberId = (UUID) session.getAttribute("userId");

        subscribeService.unsubscribeUser(subscriberId, userService.findByNickname(subscribedToNickname).getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/posts")
    @Operation(summary = "구독한 사용자의 게시글 조회", description = "내가 구독한 사용자의 게시글을 조회합니다.")
    public ResponseEntity<List<SubscribedPostResponseDto>> getSubscribedUsersPosts(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");

        return ResponseEntity.ok(subscribeService.getSubscribedUsersPosts(userId));
    }

    @GetMapping("/me/challenges")
    @Operation(summary = "구독한 사용자의 챌린지 조회", description = "내가 구독한 사용자의 챌린지를 조회합니다.")
    public ResponseEntity<List<SubscribedChallengeResponseDto>> getSubscribedUsersChallenges(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(subscribeService.getSubscribedUsersChallenges(userId));
    }

    @GetMapping("/me/books")
    @Operation(summary = "구독한 사용자의 봄날의 서 조회", description = "내가 구독한 사용자가 작성한 봄날의 서를 조회합니다.")
    public ResponseEntity<List<SubscribedBookResponseDto>> getSubscribedUsersBooks(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(subscribeService.getSubscribedUsersBooks(userId));
    }

    @GetMapping("/me/users")
    @Operation(summary = "내가 구독한 사용자 전체 조회", description = "내가 구독한 모든 사용자의 정보를 반환합니다.")
    public ResponseEntity<List<SubscribedUserResponseDto>> getSubscribedUsers(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(subscribeService.getSubscribedUsers(userId));
    }

    @GetMapping("/{subscribedToNickname}/check")
    @Operation(summary = "특정 사용자를 내가 구독했는지 확인",
            description = "내가 특정 사용자를 구독했는지 여부를 반환합니다.")
    public ResponseEntity<Boolean> checkSubscription(
            @PathVariable String subscribedToNickname,
            HttpSession session) {

        UUID subscriberId = (UUID) session.getAttribute("userId");

        UUID subscribedToId = userService.findByNickname(subscribedToNickname).getId();

        boolean isSubscribed = subscribeService.isSubscribed(subscriberId, subscribedToId);
        return ResponseEntity.ok(isSubscribed);
    }
}