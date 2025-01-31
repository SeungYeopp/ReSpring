package org.ssafy.respring.domain.comment.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.ssafy.respring.domain.comment.vo.Comment;
import org.ssafy.respring.domain.comment.vo.QComment;
import org.ssafy.respring.domain.post.vo.QPost;

import java.util.List;

public class CommentRepositoryImpl implements CommentRepositoryQuerydsl {
    private final JPAQueryFactory queryFactory;


    public CommentRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    QComment comment = new QComment("c");

    @Override
    public List<Comment> findChildrenByParentId(Long parentId) {
        return queryFactory.selectFrom(comment)
                .where(comment.parent.id.eq(parentId)) // parentId가 같은 댓글들 조회
                .fetch();
    }

    @Override
    public List<Comment> findByPostIdWithFetchJoin(Long postId) {
        return queryFactory.selectFrom(comment)
                .leftJoin(comment.children).fetchJoin()
                .where(comment.post.id.eq(postId))
                .fetch();
    }

    @Override
    public List<Comment> findByBookIdWithFetchJoin(String bookId) {
        return queryFactory.selectFrom(comment)
                .leftJoin(comment.children).fetchJoin()
                .where(comment.bookId.eq(bookId))
                .fetch();
    }
}
