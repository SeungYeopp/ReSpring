package org.ssafy.respring.domain.tag.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.QBook;
//import org.ssafy.respring.domain.book.vo.QBookTag;
import org.ssafy.respring.domain.book.vo.QBookLikes;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.tag.vo.QChallengeTag;
//import org.ssafy.respring.domain.user.vo.QUserChallenge;
//import org.ssafy.respring.domain.user.vo.QBookLikes;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.QUserChallenge;

import java.util.List;
import java.util.UUID;

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
        // QBookTag bt = QBookTag.bookTag;
        QBookLikes bl = QBookLikes.bookLikes;

        return queryFactory
                .select(ct.tag.id)
                .from(uc)
                .join(ct).on(uc.challenge.id.eq(ct.challenge.id))
                .where(uc.user.id.eq(userId))
                .union(
                        queryFactory
                                .select(bt.tag.id)
                                .from(bt)
                                .where(bt.book.id.in(
                                        queryFactory.select(bl.book.id)
                                                .from(bl)
                                                .where(bl.user.id.eq(userId))
                                ))
                )
                .groupBy(ct.tag.id)
                .orderBy(ct.tag.count().desc())
                .fetch();
    }

    /**
     * 태그 기반 챌린지 추천
     */
    @Override
    public List<Challenge> recommendChallenges(UUID userId) {
        List<Long> userTagIds = getUserTagIds(userId);

        QChallenge c = QChallenge.challenge;
        QChallengeTag ct = QChallengeTag.challengeTag;
        QUserChallenge uc = QUserChallenge.userChallenge;

        return queryFactory
                .select(c)
                .from(c)
                .join(ct).on(c.id.eq(ct.challenge.id))
                .where(ct.tag.id.in(userTagIds)
                        .and(c.id.notIn(
                                queryFactory.select(uc.challenge.id)
                                        .from(uc)
                                        .where(uc.user.id.eq(userId))
                        )))
                .groupBy(c.id)
                .orderBy(ct.tag.count().desc())
                .limit(10)
                .fetch();
    }
}
