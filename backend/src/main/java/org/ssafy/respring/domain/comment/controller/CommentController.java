package org.ssafy.respring.domain.comment.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.comment.dto.request.CommentRequestDto;
import org.ssafy.respring.domain.comment.dto.response.CommentDetailResponseDto;
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.service.CommentService;
import org.ssafy.respring.domain.comment.vo.Comment;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
@Tag(name = "댓글 관리", description = "댓글 생성, 수정, 삭제 및 조회 기능을 제공합니다.")
public class CommentController {
    private final CommentService commentService;

    @Operation(summary = "나의 게시글 댓글 조회", description = "사용자가 작성한 모든 게시글 댓글을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공")
    @GetMapping("/posts")
    public ResponseEntity<List<CommentDetailResponseDto>> getMyPostComments(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.getMyPostComments(userId));
    }

    @Operation(summary = "게시글 댓글 생성", description = "게시글에 댓글을 작성합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 생성 성공")
    @PostMapping("/posts")
    public ResponseEntity<CommentResponseDto> createPostComment(@RequestBody CommentRequestDto dto, HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.createComment(dto, userId));
    }

    @Operation(summary = "책 댓글 생성", description = "책에 댓글을 작성합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 생성 성공")
    @PostMapping("/books")
    public ResponseEntity<CommentResponseDto> createBookComment(@RequestBody CommentRequestDto dto, HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.createComment(dto, userId));
    }

    @Operation(summary = "게시글 댓글 수정", description = "특정 게시글 댓글의 내용을 수정합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 수정 성공")
    @PatchMapping("/posts/{commentId}")
    public ResponseEntity<CommentResponseDto> updatePostComment(
            @PathVariable Long commentId,
            HttpSession session,
            @RequestBody String content) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.updateComment(commentId, userId, content));
    }

    @Operation(summary = "책 댓글 수정", description = "특정 책 댓글의 내용을 수정합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 수정 성공")
    @PatchMapping("/books/{commentId}")
    public ResponseEntity<CommentResponseDto> updateBookComment(
            @PathVariable Long commentId,
            HttpSession session,
            @RequestBody String content) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.updateComment(commentId, userId, content));
    }

    @Operation(summary = "게시글 댓글 삭제", description = "특정 게시글 댓글을 삭제합니다.")
    @ApiResponse(responseCode = "204", description = "댓글 삭제 성공")
    @DeleteMapping("/posts/{commentId}")
    public ResponseEntity<Void> deletePostComment(
            @PathVariable Long commentId,
            HttpSession session
    ) {
        UUID userId = (UUID) session.getAttribute("userId");
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "책 댓글 삭제", description = "특정 책 댓글을 삭제합니다.")
    @ApiResponse(responseCode = "204", description = "댓글 삭제 성공")
    @DeleteMapping("/books/{commentId}")
    public ResponseEntity<Void> deleteBookComment(
            @PathVariable Long commentId,
            HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "게시글 댓글 조회", description = "특정 게시글에 작성된 댓글 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공")
    @GetMapping("/posts/{postId}")
    public ResponseEntity<List<CommentDto>> getPostComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @Operation(summary = "책 댓글 조회", description = "특정 책에 작성된 댓글 목록을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공")
    @GetMapping("/books/{bookId}")
    public ResponseEntity<List<CommentDto>> getBookComments(@PathVariable Long bookId) {
        return ResponseEntity.ok(commentService.getCommentsByBookId(bookId));
    }

    @Operation(summary = "나의 책 댓글 조회", description = "사용자가 작성한 모든 책 댓글을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공")
    @GetMapping("/books")
    public ResponseEntity<List<CommentDetailResponseDto>> getMyBookComments(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.getMyBookComments(userId));
    }

    @Operation(summary = "자식 댓글 조회", description = "특정 댓글의 자식 댓글들을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "자식 댓글 조회 성공")
    @GetMapping("/children/{parentId}")
    public ResponseEntity<List<CommentDetailResponseDto>> getChildrenByParentId(@PathVariable Long parentId) {
        List<CommentDetailResponseDto> children = commentService.getChildrenByParentId(parentId);
        return ResponseEntity.ok(children);
    }

    /**
     * 📌 댓글 좋아요 토글
     */
    @Operation(summary = "댓글 좋아요 토글", description = "사용자가 댓글에 좋아요를 추가하거나 취소합니다.")
    @ApiResponse(responseCode = "200", description = "좋아요 성공 또는 취소됨 (true = 좋아요, false = 취소)")
    @PostMapping("/{commentId}/like")
    public ResponseEntity<Boolean> toggleCommentLike(
            @PathVariable Long commentId,
            HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        boolean liked = commentService.toggleCommentLike(commentId, userId);
        return ResponseEntity.ok(liked);
    }

    /**
     * 📌 특정 댓글 좋아요 개수 조회
     */
    @Operation(summary = "댓글 좋아요 개수 조회", description = "특정 댓글의 좋아요 개수를 반환합니다.")
    @ApiResponse(responseCode = "200", description = "좋아요 개수 반환 성공")
    @GetMapping("/{commentId}/likes/count")
    public ResponseEntity<Integer> getCommentLikesCount(@PathVariable Long commentId) {
        int likeCount = commentService.getCommentLikesCount(commentId);
        return ResponseEntity.ok(likeCount);
    }

    /**
     * 📌 사용자가 특정 댓글에 좋아요 눌렀는지 여부 확인
     */
    @Operation(summary = "사용자 댓글 좋아요 확인", description = "사용자가 특정 댓글에 좋아요를 눌렀는지 확인합니다.")
    @ApiResponse(responseCode = "200", description = "좋아요 여부 반환 성공 (true = 좋아요, false = 좋아요 안 함)")
    @GetMapping("/{commentId}/likes/check")
    public ResponseEntity<Boolean> isCommentLikedByUser(
            @PathVariable Long commentId,
            HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        boolean liked = commentService.isCommentLikedByUser(commentId, userId);
        return ResponseEntity.ok(liked);
    }

    /**
     * 📌 댓글을 좋아요 높은 순으로 정렬하여 조회
     */
    @Operation(summary = "좋아요 높은 순 댓글 조회", description = "특정 게시글의 댓글을 좋아요 개수 기준으로 내림차순 정렬하여 반환합니다.")
    @ApiResponse(responseCode = "200", description = "정렬된 댓글 목록 반환 성공")
    @GetMapping("/posts/{postId}/sorted-by-likes")
    public ResponseEntity<List<Comment>> getCommentsSortedByLikes(@PathVariable Long postId) {
        List<Comment> sortedComments = commentService.getCommentsSortedByLikes(postId);
        return ResponseEntity.ok(sortedComments);
    }

    @Operation(summary = "사용자가 작성한 모든 댓글 조회", description = "사용자가 작성한 모든 댓글(게시글 + 책)을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "댓글 목록 조회 성공")
    @GetMapping("/my-comments")
    public ResponseEntity<List<CommentDetailResponseDto>> getMyComments(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        return ResponseEntity.ok(commentService.getMyAllComments(userId));
    }
}

