package org.ssafy.respring.domain.post.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.post.dto.request.PostRequestDto;
import org.ssafy.respring.domain.post.dto.request.PostUpdateRequestDto;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.post.service.PostService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "Post API", description = "포스트 관련 API")
public class PostController {

    private final PostService postService;
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

    @PostMapping(consumes = {"multipart/form-data"})
    @Operation(summary = "포스트 생성", description = "새로운 포스트를 생성하고 이미지를 함께 업로드합니다.")
    public ResponseEntity<Long> createPostWithImages(
            @RequestPart("postDto") @Valid PostRequestDto requestDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            HttpSession session) throws IOException {
        if (images != null && !images.isEmpty()) {
            imageService.validateTotalFileSize(images);
        }
        UUID userId = requireLogin(session);
        Long postId = postService.createPostWithImages(requestDto, images, userId);
        return ResponseEntity.ok(postId);
    }

    @GetMapping("/{post_id}")
    @Operation(summary = "포스트 세부 조회", description = "특정 ID의 포스트를 조회합니다.")
    public ResponseEntity<PostResponseDto> getPost(
            @Parameter(description = "조회할 포스트 ID", example = "2") @PathVariable Long post_id,
            HttpSession session) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(postService.getPost(post_id, userId));
    }

    @GetMapping
    @Operation(summary = "전체 포스트 조회", description = "모든 포스트를 조회합니다. 커서 기반 페이지네이션을 지원합니다.")
    public ResponseEntity<List<PostResponseDto>> getAllPosts(
            @Parameter(description = "마지막으로 조회된 포스트 ID", example = "50") @RequestParam(required = false) Long lastId,
            @Parameter(description = "가져올 포스트 개수", example = "10") @RequestParam(defaultValue = "10") int limit,
            HttpSession session) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(postService.getPostsByCursor(lastId, limit, userId));
    }


    @GetMapping("/users/{userName}")
    @Operation(summary = "사용자별 포스트 조회", description = "특정 사용자의 포스트를 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getPostsByUser(
            @Parameter(description = "조회할 사용자 닉네임", example = "김은퇴") @PathVariable String userName,
            HttpSession session
    ) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(postService.getPostsByUser(userName, userId));
    }

    @GetMapping("/my")
    @Operation(summary = "나의 포스트 조회", description = "나의 포스트를 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getMyPosts(
            HttpSession session
    ) {
        UUID userId = requireLogin(session);
        return ResponseEntity.ok(postService.getMyPosts(userId));
    }


    @PatchMapping(value = "/{post_id}", consumes = {"multipart/form-data"})
    @Operation(summary = "포스트 수정", description = "특정 포스트를 수정하고 이미지를 저장/삭제합니다.")
    public ResponseEntity<Void> updatePost(
            @Parameter(description = "수정할 포스트 ID", example = "2") @PathVariable Long post_id,
            @RequestPart("postDto") @Valid PostUpdateRequestDto requestDto,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages,
            HttpSession session) throws IOException {
        UUID userId = requireLogin(session);
        postService.updatePost(post_id, requestDto, newImages, userId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{post_id}")
    @Operation(summary = "포스트 삭제", description = "자신이 작성한 포스트를 삭제합니다.")
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "삭제할 포스트 ID", example = "2") @PathVariable Long post_id,
            HttpSession session) {
        UUID userId = requireLogin(session);
        postService.deletePost(post_id, userId); // 사용자 ID 추가
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/search")
    @Operation(summary = "포스트 검색", description = "제목을 기반으로 포스트를 검색합니다.")
    public ResponseEntity<List<PostResponseDto>> searchPosts(
            @Parameter(description = "검색할 제목", example = "Spring") @RequestParam String title,
            HttpSession session) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(postService.searchPostsByTitle(title, userId));
    }

    @GetMapping("/filter")
    @Operation(summary = "포스트 필터링", description = "카테고리를 기준으로 포스트를 필터링합니다.")
    public ResponseEntity<List<PostResponseDto>> filterPosts(
            @Parameter(description = "필터링할 카테고리", example = "INFORMATION_SHARING") @RequestParam String category,
            HttpSession session) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(postService.filterPostsByCategory(category, userId));
    }

    @GetMapping("/popular")
    @Operation(summary = "인기 포스트 조회", description = "일주일 동안 좋아요 Top 3 포스트를 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getPopularPosts(
            HttpSession session) {
        UUID userId = getUserIdFromSession(session);
        return ResponseEntity.ok(postService.getPopularPosts(userId));
    }

    @PatchMapping("/like/{post_id}")
    @Operation(summary = "좋아요 추가/취소", description = "특정 포스트에 좋아요를 추가하거나 취소합니다.")
    public ResponseEntity<String> toggleLike(
            @Parameter(description = "좋아요를 추가/취소할 포스트 ID", example = "1") @PathVariable Long post_id,
            HttpSession session) {
        UUID userId = requireLogin(session);
        boolean isLiked = postService.toggleLike(post_id, userId);
        return ResponseEntity.ok(isLiked ? "Liked" : "Unliked");
    }

    @GetMapping("/like/{post_id}")
    @Operation(summary = "좋아요 여부 조회", description = "특정 포스트에 대해 현재 사용자가 좋아요를 눌렀는지 여부를 반환합니다.")
    public ResponseEntity<Boolean> checkIfLiked(
            @Parameter(description = "좋아요 여부를 확인할 포스트 ID", example = "1") @PathVariable Long post_id,
            HttpSession session) {
        UUID userId = requireLogin(session);
        boolean isLiked = postService.isPostLikedByUser(post_id, userId);
        return ResponseEntity.ok(isLiked);
    }
}