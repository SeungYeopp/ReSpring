package org.ssafy.respring.domain.challenge.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.challenge.dto.request.ChallengeRequestDto;
import org.ssafy.respring.domain.challenge.dto.request.ChallengeUpdateRequestDto;
import org.ssafy.respring.domain.challenge.dto.response.*;
import org.ssafy.respring.domain.challenge.service.ChallengeService;
import org.ssafy.respring.domain.challenge.vo.ChallengeSortType;
import org.ssafy.respring.domain.challenge.vo.ChallengeStatus;
import org.ssafy.respring.domain.image.service.ImageService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;



@Tag(name = "챌린지 API", description = "챌린지 관련 CRUD 및 참가 기능을 제공합니다.")
@RestController
@RequestMapping("/challenges")
@RequiredArgsConstructor
public class ChallengeController {
    private final ChallengeService challengeService;
    private final ImageService imageService;

    private UUID getUserIdFromSession(HttpSession session) {
        return (UUID) session.getAttribute("userId"); // 로그인 안 했으면 null 반환
    }

    private UUID requireLogin(HttpSession session) {
        UUID userId = getUserIdFromSession(session);
        if (userId == null) {
            throw new IllegalArgumentException("❌ 로그인이 필요합니다.");
        }
        return userId;
    }

    @Operation(summary = "챌린지 생성 (이미지 업로드 포함)",
            description = "새로운 챌린지를 생성합니다. 챌린지 정보를 JSON으로 받고, 이미지는 별도로 업로드합니다.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChallengeResponseDto> createChallenge(
            @RequestPart("challengeDto") ChallengeRequestDto challengeDto, // ✅ 챌린지 정보(JSON)
            @RequestPart(value = "image", required = false) MultipartFile image, // ✅ 이미지 파일(Optional)
            HttpSession session
    ) throws IOException {

        imageService.validateFileSize(image);
        UUID userId = requireLogin(session);
        ChallengeResponseDto response = challengeService.createChallenge(challengeDto, image, userId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "챌린지 목록 조회", description = "챌린지 목록을 필터링하여 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ChallengeListResponseDto>> getAllChallenges(
            @RequestParam(value = "sort", defaultValue = "LATEST") ChallengeSortType sortType,
            HttpSession session
    ) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(challengeService.getAllChallenges(sortType, userId));
    }

    @Operation(summary = "챌린지 상세 조회",
            description = "ID를 이용하여 특정 챌린지의 상세 정보를 조회합니다. (연속 성공 기간, 성공률 포함)")
    @GetMapping("/{challengeId}")
    public ResponseEntity<ChallengeDetailResponseDto> getChallengeDetail(
            @PathVariable Long challengeId,
            HttpSession session // ✅ 현재 로그인한 사용자 ID 필요
    ) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(challengeService.getChallengeDetail(challengeId, userId));
    }

//    @Operation(summary = "챌린지 삭제", description = "해당 챌린지를 만든 유저(owner)만 삭제할 수 있습니다.")
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteChallenge(
//            @PathVariable Long id,
//            @RequestParam UUID ownerId
//    ) {
//        challengeService.deleteChallenge(id, ownerId);
//        return ResponseEntity.noContent().build();
//    }

    @Operation(summary = "챌린지 참가", description = "유저가 특정 챌린지에 참가할 수 있습니다.")
    @PostMapping("/{challengeId}/join")
    public ResponseEntity<Void> joinChallenge(
            @PathVariable Long challengeId,
            HttpSession session
    ) {
        UUID userId = requireLogin(session);
        challengeService.joinChallenge(userId, challengeId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "챌린지 나가기", description = "유저가 참가한 챌린지를 나갑니다. 마지막 참가자가 나가면 챌린지가 삭제됩니다.")
    @DeleteMapping("/{challengeId}/leave")
    public ResponseEntity<Void> leaveChallenge(
            @PathVariable Long challengeId,
            HttpSession session
    ) {
        UUID userId = requireLogin(session);
        challengeService.leaveChallenge(userId, challengeId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "좋아요 토글", description = "좋아요를 누르면 추가되고, 다시 누르면 취소됩니다.")
    @PostMapping("/{challengeId}/like")
    public ResponseEntity<Void> toggleLike(
            @PathVariable Long challengeId,
            HttpSession session
    ) {
        UUID userId = requireLogin(session);
        challengeService.toggleLike(userId, challengeId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "내가 참여한 챌린지 조회", description = "특정 유저가 참여한 챌린지 목록을 반환합니다.")
    @GetMapping("/participated")
    public ResponseEntity<List<ChallengeMyListResponseDto>> getParticipatedChallenges(HttpSession session) {
        UUID userId = requireLogin(session);
        return ResponseEntity.ok(challengeService.getParticipatedChallenges(userId));
    }

    @Operation(summary = "챌린지 검색", description = "제목에 특정 키워드가 포함된 챌린지를 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<List<ChallengeListResponseDto>> searchChallenges(
            @RequestParam String keyword,
            HttpSession session
    ) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(challengeService.searchChallenges(keyword, userId));
    }

    @Operation(summary = "챌린지 수정", description = "Owner만 챌린지의 description, 이미지, 끝나는 날짜를 수정할 수 있습니다.")
    @PatchMapping(value = "/{challengeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChallengeResponseDto> updateChallenge(
            @PathVariable Long challengeId,
            @RequestPart("updateDto") ChallengeUpdateRequestDto updateDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            HttpSession session
    ) throws IOException {
        UUID ownerId = requireLogin(session);
        return ResponseEntity.ok(challengeService.updateChallenge(challengeId, updateDto, image, ownerId));
    }

    @Operation(summary = "챌린지 참여자 조회", description = "챌린지에 참여한 모든 사용자의 ID와 총 참여자 수를 반환합니다.")
    @GetMapping("/{challengeId}/participants")
    public ResponseEntity<ChallengeParticipantsResponseDto> getChallengeParticipants(
            @PathVariable Long challengeId,
            HttpSession session
    ) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(challengeService.getChallengeParticipants(challengeId));
    }

    @Operation(summary = "챌린지 상태별 조회", description = "나의 챌린지 상태(시작 전, 진행 중, 종료됨)에 따라 조회합니다.")
    @GetMapping("/status")
    public ResponseEntity<List<ChallengeStatusResponseDto>> getChallengesByStatus(
            @RequestParam ChallengeStatus status,
            HttpSession session
    ) {
        UUID userId = requireLogin(session);
        return ResponseEntity.ok(challengeService.getChallengesByStatus(status));
    }

}
