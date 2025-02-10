package org.ssafy.respring.domain.story.repository;

import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.story.vo.QStory;
import org.ssafy.respring.domain.story.vo.Story;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class StoryRepositoryImpl implements StoryRepositoryQueryDsl {

    private final JPAQueryFactory queryFactory;

    QStory story = new QStory("s");

    @Override
    public List<Story> findAllByUserIdSortedByUpdatedAt(UUID userId) {
        return queryFactory.selectFrom(story)
                .where(story.user.id.eq(Expressions.constant(userId)))
                .orderBy(story.updatedAt.desc())
                .fetch();
    }
}
