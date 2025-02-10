package org.ssafy.respring.domain.tag.controller;

import lombok.RequiredArgsConstructor;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.tag.service.TagRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendationController {

    private final TagRecommendationService tagRecommendationService;

    @GetMapping("/challenges/{userId}")
    public ResponseEntity<List<Challenge>> recommendChallenges(@PathVariable UUID userId) {
        return ResponseEntity.ok(tagRecommendationService.recommendChallenges(userId));
    }

    @GetMapping("/books/{userId}")
    public ResponseEntity<List<Book>> recommendBooks(@PathVariable UUID userId) {
        return ResponseEntity.ok(tagRecommendationService.recommendBooks(userId));
    }
}
