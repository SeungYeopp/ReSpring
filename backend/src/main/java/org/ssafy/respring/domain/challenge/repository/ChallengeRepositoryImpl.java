package org.ssafy.respring.domain.challenge.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.QChallenge;

@Repository
@RequiredArgsConstructor
public class ChallengeRepositoryImpl implements ChallengeRepositoryQueryDsl {

    private final JPAQueryFactory queryFactory;

    @Override
    public void incrementViews(Long challengeId) {
        QChallenge challenge = QChallenge.challenge;

        queryFactory.update(challenge)
                .set(challenge.views, challenge.views.add(1))
                .where(challenge.id.eq(challengeId))
                .execute();
    }
}
