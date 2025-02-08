package org.ssafy.respring.domain.challenge.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.challenge.service.RecordsService;

import java.util.UUID;

@Tag(name = "챌린지 기록 API", description = "챌린지 성공 여부 기록 기능을 제공합니다.")
@RestController
@RequestMapping("/records")
@RequiredArgsConstructor
public class RecordsController {
    private final RecordsService recordsService;

    @Operation(summary = "챌린지 성공 여부 기록",
            description = "사용자가 챌린지 성공 여부를 기록합니다.")
    @PostMapping("/{challengeId}/users/{userId}")
    public ResponseEntity<Void> recordChallenge(
            @PathVariable UUID userId,
            @PathVariable Long challengeId,
            @RequestParam boolean isSuccess // ✅ 성공 여부 전달
    ) {
        recordsService.recordChallenge(userId, challengeId, isSuccess);
        return ResponseEntity.ok().build();
    }
}
