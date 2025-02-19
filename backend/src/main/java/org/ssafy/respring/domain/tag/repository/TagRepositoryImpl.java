package org.ssafy.respring.domain.tag.repository;

import com.querydsl.core.Tuple;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.QChallenge;
import org.ssafy.respring.domain.challenge.vo.QChallengeLikes;
import org.ssafy.respring.domain.challenge.vo.QUserChallenge;
import org.ssafy.respring.domain.tag.vo.QChallengeTag;
import org.ssafy.respring.domain.tag.vo.QTag;
import org.ssafy.respring.domain.tag.vo.Tag;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class TagRepositoryImpl implements TagRepositoryQueryDsl {

    private final JPAQueryFactory queryFactory;

    /**
     * 사용자가 선호하는 태그 ID 가져오기
     */
    @Override
    public List<Long> getUserTagIds(UUID userId) {
        QUserChallenge uc = QUserChallenge.userChallenge;
        QChallengeTag ct = QChallengeTag.challengeTag;
        QChallengeLikes cl = QChallengeLikes.challengeLikes;

        return queryFactory
                .select(ct.tag.id)
                .from(ct)
                .where(ct.challenge.id.in(
                        queryFactory.select(uc.challenge.id)
                                .from(uc)
                                .where(uc.user.id.eq(userId))
                ).or(ct.challenge.id.in( // ✅ 사용자가 좋아요한 챌린지도 포함
                        queryFactory.select(cl.challenge.id)
                                .from(cl)
                                .where(cl.user.id.eq(userId))
                )))
                .groupBy(ct.tag.id)
                .orderBy(ct.tag.count().desc())
                .fetch();
    }

    public Map<Long, Long> getUserTagCounts(UUID userId) {
        QUserChallenge uc = QUserChallenge.userChallenge;
        QChallengeTag ct = QChallengeTag.challengeTag;

        List<Tuple> tagCounts = queryFactory
                .select(ct.tag.id, ct.tag.id.count())  // ✅ 태그별 COUNT 계산
                .from(uc)
                .join(ct).on(uc.challenge.id.eq(ct.challenge.id))
                .where(uc.user.id.eq(userId))
                .groupBy(ct.tag.id)
                .fetch();

        // ✅ Map으로 변환 (tagId -> count)
        return tagCounts.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(ct.tag.id),
                        tuple -> tuple.get(ct.tag.id.count())
                ));
    }

    /**
     * 태그 기반 챌린지 추천
     */

    @Override
    public List<Challenge> recommendChallenges(UUID userId) {
        // ✅ 사용자가 좋아요를 누르거나 참여한 태그 ID 및 COUNT 조회
        Map<Long, Long> userTagCounts = getUserTagCounts(userId);

        QChallenge c = QChallenge.challenge;
        QChallengeTag ct = QChallengeTag.challengeTag;
        QUserChallenge uc = QUserChallenge.userChallenge;
        QTag tag = QTag.tag;

        // ✅ 관심 태그가 없으면 인기 챌린지 반환
        if (userTagCounts.isEmpty()) {
            return queryFactory
                    .select(c)
                    .from(c)
                    .where(c.id.notIn(
                            JPAExpressions.select(uc.challenge.id)
                                    .from(uc)
                                    .where(uc.user.id.eq(userId))
                    ))
                    .orderBy(c.participantCount.desc())
                    .limit(10)
                    .fetch();
        }

        // ✅ 태그별 COUNT 기반 정렬을 위한 CASE WHEN 제거 (MySQL `ONLY_FULL_GROUP_BY` 문제 해결)
        NumberExpression<Long> tagWeightExpression = new CaseBuilder()
                .when(ct.tag.id.in(userTagCounts.keySet())).then(ct.tag.id.count())
                .otherwise(0L);

        // ✅ QueryDSL 최적화된 쿼리 실행
        return queryFactory
                .select(c)
                .from(c)
                .join(ct).on(c.id.eq(ct.challenge.id))
                .where(
                        c.id.notIn( // ✅ 사용자가 이미 참여한 챌린지는 제외
                                JPAExpressions.select(uc.challenge.id)
                                        .from(uc)
                                        .where(uc.user.id.eq(userId))
                        )
                )
                .groupBy(c.id, ct.tag.id)  // ✅ GROUP BY에 tag.id 추가하여 정렬 문제 해결
                .orderBy(
                        tagWeightExpression.desc(), // ✅ 사용자가 많이 참여한 태그 기반 정렬
                        c.participantCount.desc()  // ✅ 참여자 수 기준 정렬
                )
                .limit(10)
                .fetch();
    }

    @Override
    public List<Tag> findTagsByChallengeId(Long challengeId) {
        QTag tag = QTag.tag;
        QChallengeTag challengeTag = QChallengeTag.challengeTag;

        return queryFactory
          .select(tag)
          .from(challengeTag)
          .join(challengeTag.tag, tag)
          .where(challengeTag.challenge.id.eq(challengeId))
          .fetch();
    }
}
