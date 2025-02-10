package org.ssafy.respring.domain.comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.comment.vo.Comment;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, Long>, CommentRepositoryQuerydsl {
    List<Comment> findByPostId(Long postId);
    List<Comment> findByBookId(Long bookId);
    List<Comment> findByUserIdAndPostNotNull(UUID userId);
    List<Comment> findByUserIdAndBookIdNotNull(UUID userId);
}
