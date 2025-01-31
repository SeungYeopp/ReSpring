package org.ssafy.respring.domain.challenge.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.challenge.service.ChallengeService;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.Records;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/challenges")
@RequiredArgsConstructor
public class ChallengeController {
    private final ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<Challenge> createChallenge(@RequestBody Challenge challenge, @RequestParam UUID userId) {
        return ResponseEntity.ok(challengeService.createChallenge(challenge, userId));
    }

    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallengeById(@PathVariable Long id) {
        return challengeService.getChallengeById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable Long id, @RequestParam UUID userId) {
        challengeService.deleteChallenge(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/participate")
    public ResponseEntity<Records> participateInChallenge(@PathVariable Long id, @RequestParam UUID userId) {
        return ResponseEntity.ok(challengeService.participateInChallenge(userId, id));
    }

//    @PostMapping("/{id}/like")
//    public ResponseEntity<Boolean> toggleLike(@PathVariable Long id, @RequestParam UUID userId) {
//        challengeService.toggleLike(id);
//        return ResponseEntity.ok().build();
//    }
}
