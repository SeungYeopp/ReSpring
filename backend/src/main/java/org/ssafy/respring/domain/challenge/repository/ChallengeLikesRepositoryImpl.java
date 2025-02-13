package org.ssafy.respring.domain.challenge.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.ChallengeLikes;
import org.ssafy.respring.domain.challenge.vo.QChallengeLikes;

import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class ChallengeLikesRepositoryImpl implements ChallengeLikesQueryDsl{

    private final JPAQueryFactory queryFactory;

    QChallengeLikes challengeLikes = new QChallengeLikes("cl");

    @Override
    public Optional<ChallengeLikes> findByUserIdAndChallengeId(Long challengeId, UUID userId) {
        QChallengeLikes challengeLikes = QChallengeLikes.challengeLikes;

        ChallengeLikes result = queryFactory
                .selectFrom(challengeLikes)
                .where(challengeLikes.challenge.id.eq(challengeId)
                        .and(challengeLikes.user.id.eq(userId)))
                .fetchOne();

        return Optional.ofNullable(result);
    }
}
