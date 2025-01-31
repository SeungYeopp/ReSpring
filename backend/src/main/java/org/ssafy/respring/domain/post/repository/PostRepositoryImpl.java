package org.ssafy.respring.domain.post.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.comment.vo.QComment;
import org.ssafy.respring.domain.post.dto.response.PostResponseDto;
import org.ssafy.respring.domain.post.vo.Category;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.post.vo.QPost;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class PostRepositoryImpl implements PostRepositoryQuerydsl {

    private final JPAQueryFactory queryFactory;


    public PostRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    QPost post = new QPost("p");
    QComment comment = new QComment("c");

    @Override
    public List<Post> searchByTitle(String title) {
        return queryFactory.selectFrom(post)
                .where(post.title.containsIgnoreCase(title))
                .fetch();
    }

    @Override
    public List<Post> filterByCategory(String category) {
        Category categoryEnum;
        try {
            categoryEnum = Category.valueOf(category);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid category: " + category);
        }

        return queryFactory.selectFrom(post)
                .where(post.category.eq(categoryEnum))
                .fetch();
    }

    @Override
    public List<Post> findByCursor(Long lastId, int limit) {
        BooleanExpression cursorCondition = (lastId != null) ? post.id.lt(lastId) : null;

        return queryFactory.selectFrom(post)
                .where(cursorCondition)
                .orderBy(post.id.desc()) // 최신 포스트부터 가져오기
                .limit(limit)
                .fetch();
    }

//    @Override
//    public List<Post> findTop3ByLikesInPastWeek(LocalDateTime oneWeekAgo) {
//        return queryFactory.selectFrom(post)
//                .where(post.createdAt.after(oneWeekAgo))
//                .orderBy(post.likes.desc())
//                .limit(3)
//                .fetch();
//    }

    @Override
    public List<Tuple> findTop3ByLikesInPastWeekWithComments(LocalDateTime oneWeekAgo) {
        return queryFactory
                .select(post, comment.count()) // ✅ Post 엔티티 + 댓글 개수 조회
                .from(post)
                .leftJoin(comment).on(comment.post.eq(post))
                .where(post.createdAt.after(oneWeekAgo))
                .groupBy(post.id)
                .orderBy(post.likes.desc())
                .limit(3)
                .fetch();
    }


    @Override
    public boolean isPostLikedByUser(Long postId, UUID userId) {
        Integer count = queryFactory
                .selectOne()
                .from(post)
                .where(post.id.eq(postId)
                        .and(post.likedUsers.contains(userId)))
                .fetchFirst();

        return count != null;
    }

    @Override
    public Post findPostWithComments(Long postId) {
        return queryFactory
                .selectFrom(post)
                .leftJoin(post.comments).fetchJoin() // ✅ 댓글과 함께 가져오기
                .where(post.id.eq(postId))
                .fetchOne(); // ✅ Tuple 대신 Post 객체 그대로 반환
    }


}
