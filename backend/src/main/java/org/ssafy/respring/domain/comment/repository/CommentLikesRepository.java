package org.ssafy.respring.domain.comment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.comment.vo.CommentLikes;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.Optional;

public interface CommentLikesRepository extends JpaRepository<CommentLikes, Long> {
    Optional<CommentLikes> findByUserAndComment(User user, Comment comment);
    int countByComment(Comment comment); // 해당 댓글의 좋아요 수 조회
    List<CommentLikes> findByUser(User user); // 사용자가 좋아요 누른 댓글 리스트 조회
}
