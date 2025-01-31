package org.ssafy.respring.domain.comment.repository;

import org.ssafy.respring.domain.comment.vo.Comment;

import java.util.List;

public interface CommentRepositoryQuerydsl {
    List<Comment> findChildrenByParentId(Long parentId);
    List<Comment> findByPostIdWithFetchJoin(Long postId);
    List<Comment> findByBookIdWithFetchJoin(String bookId);
}
