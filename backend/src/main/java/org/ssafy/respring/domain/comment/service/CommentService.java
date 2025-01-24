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
        User user = new User();
        user.setId(dto.getUserId());

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setUser(user);

        if (dto.getPostId() != null) {
            Post post = new Post();
            post.setId(dto.getPostId());
            comment.setPost(post);
        }

        if (dto.getBookId() != null) {
            Book book = new Book();
            book.setId(dto.getBookId());
            comment.setBook(book);
        }

        if (dto.getParentId() != null) {
            Comment parent = commentRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("부모 댓글이 존재하지 않습니다."));

            if (parent.getParent() != null) {
                throw new IllegalStateException("대댓글에는 댓글을 추가할 수 없습니다.");
            }

            if (parent.getPost() != null && dto.getPostId() != null && !parent.getPost().getId().equals(dto.getPostId())) {
                throw new IllegalStateException("다른 게시글의 댓글에는 대댓글을 추가할 수 없습니다.");
            }

            if (parent.getBook() != null && dto.getBookId() != null && !parent.getBook().getId().equals(dto.getBookId())) {
                throw new IllegalStateException("다른 책의 댓글에는 대댓글을 추가할 수 없습니다.");
            }

            comment.setParent(parent);
        }

        Comment savedComment = commentRepository.save(comment);
        return mapToResponseDto(savedComment);
    }

    @Transactional
    public CommentResponseDto updateComment(Long commentId, UUID userId, String content) {
        // 1. 댓글 조회
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 2. 요청한 사용자와 작성자가 같은지 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 수정할 권한이 없습니다.");
        }

        // 3. 댓글 내용 수정
        comment.setContent(content);
        commentRepository.save(comment);

        // 4. 수정된 댓글 반환
        return mapToResponseDto(comment);
    }


    @Transactional
    public void deleteComment(Long commentId, UUID userId) {
        // 1. 댓글 조회
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("댓글을 찾을 수 없습니다."));

        // 2. 요청한 사용자와 작성자가 같은지 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("댓글을 삭제할 권한이 없습니다.");
        }

        // 3. 댓글 내용 삭제 처리
        comment.setContent("삭제된 댓글입니다.");
        commentRepository.save(comment);
    }

    public List<CommentResponseDto> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public List<CommentResponseDto> getCommentsByBookId(Long bookId) {
        return commentRepository.findByBookId(bookId)
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

    private CommentResponseDto mapToResponseDto(Comment comment) {
        CommentResponseDto dto = new CommentResponseDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setUsername(comment.getUser().getUsername());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setParentId(comment.getParent() != null ? comment.getParent().getId() : null);
        return dto;
    }
}
