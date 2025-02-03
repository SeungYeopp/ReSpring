package org.ssafy.respring.domain.challenge.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.UUID;



@Tag(name = "챌린지 API", description = "챌린지 관련 CRUD 및 참가 기능을 제공합니다.")
@RestController
@RequestMapping("/challenges")
@RequiredArgsConstructor
public class ChallengeController {
    private final ChallengeService challengeService;

    @Operation(summary = "챌린지 생성 (이미지 업로드 포함)",
            description = "새로운 챌린지를 생성합니다. 챌린지 정보를 JSON으로 받고, 이미지는 별도로 업로드합니다.")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChallengeResponseDto> createChallenge(
            @RequestPart("challengeDto") ChallengeRequestDto challengeDto, // ✅ 챌린지 정보(JSON)
            @RequestPart(value = "image", required = false) MultipartFile image // ✅ 이미지 파일(Optional)
    ) throws IOException {
        ChallengeResponseDto response = challengeService.createChallenge(challengeDto, image);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "챌린지 목록 조회", description = "챌린지 목록을 필터링하여 조회합니다.")
    @GetMapping
    public ResponseEntity<List<ChallengeListResponseDto>> getAllChallenges(
            @RequestParam(value = "sort", defaultValue = "LATEST") ChallengeSortType sortType) {
        return ResponseEntity.ok(challengeService.getAllChallenges(sortType));
    }

    @Operation(summary = "챌린지 상세 조회",
            description = "ID를 이용하여 특정 챌린지의 상세 정보를 조회합니다. (연속 성공 기간, 성공률 포함)")
    @GetMapping("/{challengeId}")
    public ResponseEntity<ChallengeDetailResponseDto> getChallengeDetail(
            @PathVariable Long challengeId,
            @RequestParam UUID userId // ✅ 현재 로그인한 사용자 ID 필요
    ) {
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
    @PostMapping("/{challengeId}/join/{userId}")
    public ResponseEntity<Void> joinChallenge(@PathVariable UUID userId, @PathVariable Long challengeId) {
        challengeService.joinChallenge(userId, challengeId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "챌린지 나가기", description = "유저가 참가한 챌린지를 나갑니다. 마지막 참가자가 나가면 챌린지가 삭제됩니다.")
    @DeleteMapping("/{challengeId}/leave/{userId}")
    public ResponseEntity<Void> leaveChallenge(@PathVariable UUID userId, @PathVariable Long challengeId) {
        challengeService.leaveChallenge(userId, challengeId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "좋아요 토글", description = "좋아요를 누르면 추가되고, 다시 누르면 취소됩니다.")
    @PostMapping("/{challengeId}/like/{userId}")
    public ResponseEntity<Void> toggleLike(@PathVariable UUID userId, @PathVariable Long challengeId) {
        challengeService.toggleLike(userId, challengeId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "내가 참여한 챌린지 조회", description = "특정 유저가 참여한 챌린지 목록을 반환합니다.")
    @GetMapping("/participated/{userId}")
    public ResponseEntity<List<ChallengeMyListResponseDto>> getParticipatedChallenges(@PathVariable UUID userId) {
        return ResponseEntity.ok(challengeService.getParticipatedChallenges(userId));
    }

    @Operation(summary = "챌린지 검색", description = "제목에 특정 키워드가 포함된 챌린지를 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<List<ChallengeListResponseDto>> searchChallenges(@RequestParam String keyword) {
        return ResponseEntity.ok(challengeService.searchChallenges(keyword));
    }

    @Operation(summary = "챌린지 수정", description = "Owner만 챌린지의 description, 이미지, 끝나는 날짜를 수정할 수 있습니다.")
    @PatchMapping(value = "/{challengeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ChallengeResponseDto> updateChallenge(
            @PathVariable Long challengeId,
            @RequestPart("updateDto") ChallengeUpdateRequestDto updateDto,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        return ResponseEntity.ok(challengeService.updateChallenge(challengeId, updateDto, image));
    }

    @Operation(summary = "챌린지 참여자 조회", description = "챌린지에 참여한 모든 사용자의 ID와 총 참여자 수를 반환합니다.")
    @GetMapping("/{challengeId}/participants")
    public ResponseEntity<ChallengeParticipantsResponseDto> getChallengeParticipants(@PathVariable Long challengeId) {
        return ResponseEntity.ok(challengeService.getChallengeParticipants(challengeId));
    }

}
