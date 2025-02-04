package org.ssafy.respring.domain.subscribe.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedChallengeResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedPostResponseDto;
import org.ssafy.respring.domain.subscribe.dto.response.SubscribedUserResponseDto;
import org.ssafy.respring.domain.subscribe.service.SubscribeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscribe API", description = "사용자 구독 기능을 제공합니다.")
public class SubscribeController {

    private final SubscribeService subscribeService;

    @PostMapping("/{subscriberId}/{subscribedToId}")
    @Operation(summary = "사용자 구독", description = "특정 사용자를 구독합니다.")
    public ResponseEntity<Void> subscribeUser(@PathVariable UUID subscriberId, @PathVariable UUID subscribedToId) {
        subscribeService.subscribeUser(subscriberId, subscribedToId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{subscriberId}/{subscribedToId}")
    @Operation(summary = "사용자 구독 취소", description = "특정 사용자의 구독을 취소합니다.")
    public ResponseEntity<Void> unsubscribeUser(@PathVariable UUID subscriberId, @PathVariable UUID subscribedToId) {
        subscribeService.unsubscribeUser(subscriberId, subscribedToId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/posts")
    @Operation(summary = "구독한 사용자의 게시글 조회", description = "내가 구독한 사용자의 게시글을 조회합니다.")
    public ResponseEntity<List<SubscribedPostResponseDto>> getSubscribedUsersPosts(@PathVariable UUID userId) {
        return ResponseEntity.ok(subscribeService.getSubscribedUsersPosts(userId));
    }

    @GetMapping("/{userId}/challenges")
    @Operation(summary = "구독한 사용자의 챌린지 조회", description = "내가 구독한 사용자의 챌린지를 조회합니다.")
    public ResponseEntity<List<SubscribedChallengeResponseDto>> getSubscribedUsersChallenges(@PathVariable UUID userId) {
        return ResponseEntity.ok(subscribeService.getSubscribedUsersChallenges(userId));
    }

    @GetMapping("/{userId}/users")
    @Operation(summary = "내가 구독한 사용자 전체 조회", description = "내가 구독한 모든 사용자의 정보를 반환합니다.")
    public ResponseEntity<List<SubscribedUserResponseDto>> getSubscribedUsers(@PathVariable UUID userId) {
        return ResponseEntity.ok(subscribeService.getSubscribedUsers(userId));
    }
}