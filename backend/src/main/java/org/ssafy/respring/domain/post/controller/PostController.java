package org.ssafy.respring.domain.post.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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

    @PostMapping(consumes = {"multipart/form-data"})
    @Operation(summary = "포스트 생성", description = "새로운 포스트를 생성하고 이미지를 함께 업로드합니다.")
    public ResponseEntity<Long> createPostWithImages(
            @RequestPart("postDto") @Valid PostRequestDto requestDto,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {
        Long postId = postService.createPostWithImages(requestDto, images);
        return ResponseEntity.ok(postId);
    }

    @GetMapping("/{post_id}")
    @Operation(summary = "포스트 세부 조회", description = "특정 ID의 포스트를 조회합니다.")
    public ResponseEntity<PostResponseDto> getPost(
            @Parameter(description = "조회할 포스트 ID", example = "2") @PathVariable Long post_id) {
        return ResponseEntity.ok(postService.getPost(post_id));
    }

    @GetMapping("/all")
    @Operation(summary = "전체 포스트 조회", description = "모든 포스트를 조회합니다. 커서 기반 페이지네이션을 지원합니다.")
    public ResponseEntity<List<PostResponseDto>> getAllPosts(
            @Parameter(description = "마지막으로 조회된 포스트 ID", example = "50") @RequestParam(required = false) Long lastId,
            @Parameter(description = "가져올 포스트 개수", example = "10") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(postService.getPostsByCursor(lastId, limit));
    }


    @GetMapping
    @Operation(summary = "내 포스트 조회", description = "특정 사용자의 포스트를 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getMyPosts(
            @Parameter(description = "조회할 사용자 UUID", example = "dd5a7b3c-d887-11ef-b310-d4f32d147183") @RequestParam UUID userId) {
        return ResponseEntity.ok(postService.getMyPosts(userId));
    }

    @PatchMapping(value = "/{post_id}", consumes = {"multipart/form-data"})
    @Operation(summary = "포스트 수정", description = "특정 포스트를 수정하고 이미지를 저장/삭제합니다.")
    public ResponseEntity<Void> updatePost(
            @Parameter(description = "수정할 포스트 ID", example = "2") @PathVariable Long post_id,
            @RequestPart("postDto") @Valid PostUpdateRequestDto requestDto,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages) throws IOException {
        postService.updatePost(post_id, requestDto, newImages);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{post_id}")
    @Operation(summary = "포스트 삭제", description = "자신이 작성한 포스트를 삭제합니다.")
    public ResponseEntity<Void> deletePost(
            @Parameter(description = "삭제할 포스트 ID", example = "2") @PathVariable Long post_id,
            @Parameter(description = "삭제 요청을 보낸 사용자 ID", example = "dd5a7b3c-d887-11ef-b310-d4f32d147183") @RequestParam UUID userId) {
        postService.deletePost(post_id, userId); // 사용자 ID 추가
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/search")
    @Operation(summary = "포스트 검색", description = "제목을 기반으로 포스트를 검색합니다.")
    public ResponseEntity<List<PostResponseDto>> searchPosts(
            @Parameter(description = "검색할 제목", example = "Spring") @RequestParam String title) {
        return ResponseEntity.ok(postService.searchPostsByTitle(title));
    }

    @GetMapping("/filter")
    @Operation(summary = "포스트 필터링", description = "카테고리를 기준으로 포스트를 필터링합니다.")
    public ResponseEntity<List<PostResponseDto>> filterPosts(
            @Parameter(description = "필터링할 카테고리", example = "INFORMATION_SHARING") @RequestParam String category) {
        return ResponseEntity.ok(postService.filterPostsByCategory(category));
    }

    @GetMapping("/popular")
    @Operation(summary = "인기 포스트 조회", description = "일주일 동안 좋아요 Top 3 포스트를 조회합니다.")
    public ResponseEntity<List<PostResponseDto>> getPopularPosts() {
        return ResponseEntity.ok(postService.getPopularPosts());
    }

    @PatchMapping("/like/{post_id}")
    @Operation(summary = "좋아요 추가/취소", description = "특정 포스트에 좋아요를 추가하거나 취소합니다.")
    public ResponseEntity<String> toggleLike(
            @Parameter(description = "좋아요를 추가/취소할 포스트 ID", example = "1") @PathVariable Long post_id,
            @Parameter(description = "좋아요를 누른 사용자 UUID", example = "dd5a7b3c-d887-11ef-b310-d4f32d147183") @RequestParam UUID userId) {
        boolean isLiked = postService.toggleLike(post_id, userId);
        return ResponseEntity.ok(isLiked ? "Liked" : "Unliked");
    }
}