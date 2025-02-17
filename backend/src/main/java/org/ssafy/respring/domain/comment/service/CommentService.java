package org.ssafy.respring.domain.comment.service;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.ssafy.respring.domain.book.repository.BookRepository;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.comment.dto.request.CommentRequestDto;
import org.ssafy.respring.domain.comment.dto.response.CommentDetailResponseDto;
import org.ssafy.respring.domain.comment.dto.response.CommentDto;
import org.ssafy.respring.domain.comment.dto.response.CommentResponseDto;
import org.ssafy.respring.domain.comment.repository.CommentLikesRepository;
import org.ssafy.respring.domain.comment.repository.CommentRepository;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.comment.vo.CommentLikes;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.notification.service.NotificationService;
import org.ssafy.respring.domain.notification.vo.NotificationType;
import org.ssafy.respring.domain.notification.vo.TargetType;
import org.ssafy.respring.domain.post.repository.PostRepository;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CommentLikesRepository commentLikesRepository;

    @Lazy
    private final NotificationService notificationService;
    private final PostRepository postRepository;
    private final BookRepository bookRepository;

    private final ImageService imageService;

    public List<CommentDetailResponseDto> getMyPostComments(UUID userId) {
        return commentRepository.findByUserIdAndPostNotNull(userId)
                .stream()
                .map(this::mapToDetailResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponseDto createComment(CommentRequestDto dto,UUID userId) {
        // 1. 유저 설정
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다. ID: " + userId));

        // 2. 댓글 객체 생성
        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setUser(user);

        // 3. 게시글 또는 책 설정
        if (dto.getPostId() != null) {
            Post post = postRepository.findById(dto.getPostId())
                    .orElseThrow(() -> new IllegalArgumentException("❌ 게시글을 찾을 수 없습니다. ID: " + dto.getPostId()));
            comment.setPost(post);
        }

        if (dto.getBookId() != null) {
            Book book = bookRepository.findById(dto.getBookId())
                    .orElseThrow(() -> new IllegalArgumentException("❌ 게시글을 찾을 수 없습니다. ID: " + dto.getBookId()));
            comment.setBook(book);

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

        // ✅ 알림 전송 로직 추가
        sendNotificationForComment(savedComment, user);

        return mapToResponseDto(savedComment);
    }

    // ✅ 알림 전송 메서드 추가
    private void sendNotificationForComment(Comment comment, User commenter) {
        if (comment.getPost() != null) {
            Post post = comment.getPost();
            if (post.getUser() == null) {
                throw new IllegalStateException("❌ 게시글의 작성자 정보가 없습니다. postId=" + post.getId());
            }
            User postOwner = post.getUser();
            if (!postOwner.getId().equals(commenter.getId())) {
                notificationService.sendNotification(
                        postOwner.getId(),
                        NotificationType.COMMENT,
                        TargetType.POST,
                        post.getId(),
                        commenter.getUserNickname() + "님이 당신의 게시글에 댓글을 남겼습니다."
                );
            }
        }

        if (comment.getBook() != null) {
            Book book = comment.getBook();
            if(book.getAuthor() == null){
                throw new IllegalStateException("❌ 자서전의 작성자 정보가 없습니다. postId=" + book.getId());
            }
            User bookOwner = book.getAuthor();
            if (!bookOwner.getId().equals(commenter.getId())) {
                // 책 작성자에게 알림 전송
                notificationService.sendNotification(
                        bookOwner.getId(),
                        NotificationType.COMMENT,
                        TargetType.BOOK,
                        book.getId(),
                        commenter.getUserNickname() + "님이 당신의 책에 댓글을 남겼습니다."
                );
            }
        }

        if (comment.getParent() != null) {
            Comment parentComment = comment.getParent();
            User parentUser = parentComment.getUser();
            if (!parentUser.getId().equals(commenter.getId())) {
                // 부모 댓글 작성자에게 알림 전송 (대댓글 알림)
                notificationService.sendNotification(
                        parentUser.getId(),
                        NotificationType.REPLY,
                        TargetType.COMMENT,
                        parentComment.getId(),
                        commenter.getUserNickname() + "님이 당신의 댓글에 답글을 남겼습니다."
                );
            }
        }
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

    public List<CommentDto> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdWithFetchJoin(postId)
                .stream()
                .map(this::mapToDto)
                .sorted((c1, c2) -> Integer.compare(c2.getLikeCount(), c1.getLikeCount()))
                .collect(Collectors.toList());
    }

    public List<CommentDto> getCommentsByBookId(Long bookId) {
        return commentRepository.findByBookIdWithFetchJoin(bookId)
                .stream()
                .map(this::mapToDto)
                .sorted((c1, c2) -> Integer.compare(c2.getLikeCount(), c1.getLikeCount()))
                .collect(Collectors.toList());
    }

    public List<CommentDetailResponseDto> getChildrenByParentId(Long parentId) {
        List<Comment> children = commentRepository.findChildrenByParentId(parentId);
        return children.stream()
                .map(this::mapToDetailResponseDto)
                .collect(Collectors.toList());
    }

    public List<CommentDetailResponseDto> getMyBookComments(UUID userId) {
        // 1. 사용자가 작성한 책 댓글 조회
        return commentRepository.findByUserIdAndBookIdNotNull(userId)
                .stream()
                .map(this::mapToDetailResponseDto)
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

    private CommentDetailResponseDto mapToDetailResponseDto(Comment comment) {
        String content = comment.isDeleted() ? "삭제된 댓글입니다." : comment.getContent();
        int likeCount = commentLikesRepository.countByComment(comment);
        return new CommentDetailResponseDto(
                comment.getId(),
                content,
                comment.getUser().getUserNickname(),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getParent() != null ? comment.getParent().getId() : null,
                comment.getPost() != null ? comment.getPost().getId() : null,   // ✅ 게시글 ID 추가
                comment.getBook() != null ? comment.getBook().getId() : null,
                comment.getPost() != null ? comment.getPost().getTitle(): null,
                comment.getBook() != null ? comment.getBook().getTitle() : null,
                likeCount
        );
    }

    private CommentDto mapToDto(Comment comment) {
        String content = comment.isDeleted() ? "삭제된 댓글입니다." : comment.getContent();
        int likeCount = commentLikesRepository.countByComment(comment);
        return new CommentDto(
                comment.getId(),
                content,
                comment.getUser().getUserNickname(),
                imageService.generatePresignedUrl(comment.getUser().getProfileImage()),
                comment.getCreatedAt(),
                comment.getUpdatedAt(),
                comment.getParent() != null ? comment.getParent().getId() : null,
                likeCount
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
        if (parent.getBook() != null && dto.getBookId() != null && !parent.getBook().getId().equals(dto.getBookId())) {
            throw new IllegalStateException("다른 책의 댓글에는 대댓글을 추가할 수 없습니다.");
        }
    }

    /** 📌 댓글 좋아요 토글 */
    @Transactional
    public boolean toggleCommentLike(Long commentId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 댓글을 찾을 수 없습니다."));

        Optional<CommentLikes> existingLike = commentLikesRepository.findByUserAndComment(user, comment);

        if (existingLike.isPresent()) {
            // 좋아요가 이미 있으면 삭제 (좋아요 취소)
            commentLikesRepository.delete(existingLike.get());
            return false; // 좋아요 해제
        } else {
            // 좋아요 추가
            CommentLikes newLike = CommentLikes.builder()
                    .user(user)
                    .comment(comment)
                    .build();
            commentLikesRepository.save(newLike);

            UUID commentOwnerId = comment.getUser().getId();
            if (!commentOwnerId.equals(userId)) {
                notificationService.sendNotification(
                        commentOwnerId,                // 알림 받을 사람 (댓글 작성자)
                        NotificationType.LIKE,         // 알림 유형: 좋아요
                        TargetType.COMMENT,            // 대상 유형: 댓글
                        commentId,                     // 타겟 ID(댓글 ID)
                        user.getUserNickname() + "님이 당신의 댓글을 좋아합니다!"
                );
            }
            return true; // 좋아요 등록
        }
    }

    /** 📌 댓글 좋아요 수 조회 */
    public int getCommentLikesCount(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 댓글을 찾을 수 없습니다."));
        return commentLikesRepository.countByComment(comment);
    }

    /** 📌 사용자가 특정 댓글에 좋아요를 눌렀는지 확인 */
    public boolean isCommentLikedByUser(Long commentId, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 사용자를 찾을 수 없습니다."));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("❌ 댓글을 찾을 수 없습니다."));

        return commentLikesRepository.findByUserAndComment(user, comment).isPresent();
    }

    /** 📌 좋아요 많은 순 정렬 */
    public List<Comment> getCommentsSortedByLikes(Long postId) {
        return commentRepository.findByPostIdWithFetchJoin(postId)
                .stream()
                .sorted((c1, c2) -> Integer.compare(
                        getCommentLikesCount(c2.getId()), // 내림차순 정렬
                        getCommentLikesCount(c1.getId())
                ))
                .collect(Collectors.toList());
    }

    public List<CommentDetailResponseDto> getMyAllComments(UUID userId) {
        // 1️⃣ 게시글 댓글 조회
        List<CommentDetailResponseDto> postComments = commentRepository.findByUserIdAndPostNotNull(userId)
                .stream()
                .map(this::mapToDetailResponseDto)
                .collect(Collectors.toList());

        // 2️⃣ 책 댓글 조회
        List<CommentDetailResponseDto> bookComments = commentRepository.findByUserIdAndBookIdNotNull(userId)
                .stream()
                .map(this::mapToDetailResponseDto)
                .collect(Collectors.toList());

        // 3️⃣ 댓글 목록 합치기 & 좋아요 개수 순으로 정렬
        return Stream.concat(postComments.stream(), bookComments.stream())
                .sorted((c1, c2) -> Integer.compare(c2.getLikeCount(), c1.getLikeCount())) // ✅ 좋아요 개수 내림차순 정렬
                .collect(Collectors.toList());
    }
}
