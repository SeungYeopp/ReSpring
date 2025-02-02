package org.ssafy.respring.domain.comment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.comment.dto.request.CommentRequestDto;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.repository.CommentRepository;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;

    public List<CommentResponseDto> getMyPostComments(UUID userId) {
        return commentRepository.findByUserIdAndPostNotNull(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDto createComment(CommentRequestDto dto) {
        // 1. 유저 설정
        User user = new User();
        user.setId(dto.getUserId());

        // 2. 댓글 객체 생성
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setUser(user);

        // 3. 게시글 또는 책 설정
        if (dto.getPostId() != null) {
            Post post = new Post();
            post.setId(dto.getPostId());
            comment.setPost(post);
        }

        if (dto.getBookId() != null) {
            comment.setBookId(dto.getBookId());
        }

        // 4. 부모 댓글 설정
        if (dto.getParentId() != null) {
            Comment parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글이 존재하지 않습니다."));
            validateParentComment(parent, dto);
            comment.setParent(parent);
        }

        // 5. 저장 및 반환
        Comment savedComment = commentRepository.save(comment);
        return mapToResponseDto(savedComment);
    }

    @Transactional
    public CommentResponseDto updateComment(Long commentId, UUID userId, String content) {
        // 1. 댓글 조회
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 2. 삭제된 댓글인지 확인
        if (comment.isDeleted()) {
            throw new IllegalStateException("삭제된 댓글은 수정할 수 없습니다.");
        }

        // 3. 요청한 사용자와 작성자가 같은지 확인
        validateUserPermission(comment, userId);

        // 4. 댓글 내용 수정
        comment.setContent(content);
        return mapToResponseDto(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, UUID userId) {
        // 1. 댓글 조회
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 2. 요청한 사용자와 작성자가 같은지 확인
        validateUserPermission(comment, userId);

        // 3. Soft Delete 처리
        comment.setContent("삭제된 댓글입니다.");
        comment.setDeleted(true);
    }

    public List<CommentResponseDto> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdWithFetchJoin(postId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<CommentResponseDto> getCommentsByBookId(String bookId) {
        return commentRepository.findByBookIdWithFetchJoin(bookId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<CommentResponseDto> getChildrenByParentId(Long parentId) {
        List<Comment> children = commentRepository.findChildrenByParentId(parentId);
        return children.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<CommentResponseDto> getMyBookComments(UUID userId) {
        // 1. 사용자가 작성한 책 댓글 조회
        return commentRepository.findByUserIdAndBookIdNotNull(userId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private CommentResponseDto mapToResponseDto(Comment comment) {
        String content = comment.isDeleted() ? "삭제된 댓글입니다." : comment.getContent();
        return new CommentResponseDto(
                comment.getId(),
                content,
                comment.getUser().getUserNickname(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getParent() != null ? comment.getParent().getId() : null
        );
    }

    private void validateUserPermission(Comment comment, UUID userId) {
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 수정/삭제할 권한이 없습니다.");
        }
    }

    private void validateParentComment(Comment parent, CommentRequestDto dto) {
        if (parent.getParent() != null) {
            throw new IllegalStateException("대댓글에는 댓글을 추가할 수 없습니다.");
        }
        if (parent.getPost() != null && dto.getPostId() != null && !parent.getPost().getId().equals(dto.getPostId())) {
            throw new IllegalStateException("다른 게시글의 댓글에는 대댓글을 추가할 수 없습니다.");
        }
        if (parent.getBookId() != null && dto.getBookId() != null && !parent.getBookId().equals(dto.getBookId())) {
            throw new IllegalStateException("다른 책의 댓글에는 대댓글을 추가할 수 없습니다.");
        }
    }
}
