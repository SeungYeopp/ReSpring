package org.ssafy.respring.post.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.post.vo.Category;
import org.ssafy.respring.post.vo.Post;
import org.ssafy.respring.post.vo.QPost;

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

}
