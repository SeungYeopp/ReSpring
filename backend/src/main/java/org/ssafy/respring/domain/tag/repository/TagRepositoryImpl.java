package org.ssafy.respring.domain.tag.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.ssafy.respring.domain.book.vo.Book;
import org.ssafy.respring.domain.book.vo.QBook;
//import org.ssafy.respring.domain.book.vo.QBookTag;
import org.ssafy.respring.domain.book.vo.QBookLikes;
import org.ssafy.respring.domain.challenge.vo.Challenge;
import org.ssafy.respring.domain.challenge.vo.QChallenge;
import org.ssafy.respring.domain.tag.vo.QChallengeTag;
//import org.ssafy.respring.domain.user.vo.QUserChallenge;
//import org.ssafy.respring.domain.user.vo.QBookLikes;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.challenge.vo.QUserChallenge;
import org.ssafy.respring.domain.tag.vo.QTag;
import org.ssafy.respring.domain.tag.vo.Tag;

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
        // QBookLikes bl = QBookLikes.bookLikes;

        return queryFactory
          .select(ct.tag.id)
          .from(uc)
          .join(ct).on(uc.challenge.id.eq(ct.challenge.id))
          .where(uc.user.id.eq(userId))
          .groupBy(ct.tag.id)
          .orderBy(ct.tag.count().desc())
          .fetch();
    }

    /**
     * 태그 기반 챌린지 추천
     */
    @Override
    public List<Challenge> recommendChallenges(UUID userId) {
        // 사용자가 관심 있는 태그 목록 가져오기
        List<Long> userTagIds = getUserTagIds(userId);

        QChallenge c = QChallenge.challenge;
        QChallengeTag ct = QChallengeTag.challengeTag;
        QUserChallenge uc = QUserChallenge.userChallenge;

        // 🚀 사용자의 관심 태그가 없는 경우, 참여자 수가 많은 챌린지 10개 추천
        if (userTagIds.isEmpty()) {
            return queryFactory
              .select(c)
              .from(c)
              .orderBy(c.participantCount.desc()) // 참여자 수 내림차순 정렬
              .limit(10)
              .fetch();
        }

        // 🚀 사용자의 관심 태그가 있는 경우, 태그 기반 챌린지 추천
        return queryFactory
          .select(c)
          .from(c)
          .join(ct).on(c.id.eq(ct.challenge.id))
          .where(
            ct.tag.id.in(userTagIds)
              .and(c.id.notIn(
                queryFactory.select(uc.challenge.id)
                  .from(uc)
                  .where(uc.user.id.eq(userId))
              ))
          )
          .orderBy(ct.tag.count().desc(),
                    ct.tag.id.count().divide( // ✅ Jaccard 유사도 기반 정렬
                        queryFactory.select(ct.tag.id.count()).from(ct).where(ct.challenge.id.eq(c.id))
                      ).desc())
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
