package org.ssafy.respring.domain.post.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.post.vo.Category;
import org.ssafy.respring.domain.post.vo.Post;
import org.ssafy.respring.domain.post.vo.QPost;

import java.util.List;

@Repository
public class PostRepositoryImpl implements PostRepositoryQuerydsl {

    private final JPAQueryFactory queryFactory;


    public PostRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    QPost post = new QPost("p");

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

}
