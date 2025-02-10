package org.ssafy.respring.domain.user.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 1214178109L;

    public static final QUser user = new QUser("user");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final ListPath<org.ssafy.respring.domain.challenge.vo.Challenge, org.ssafy.respring.domain.challenge.vo.QChallenge> createdChallenges = this.<org.ssafy.respring.domain.challenge.vo.Challenge, org.ssafy.respring.domain.challenge.vo.QChallenge>createList("createdChallenges", org.ssafy.respring.domain.challenge.vo.Challenge.class, org.ssafy.respring.domain.challenge.vo.QChallenge.class, PathInits.DIRECT2);

    public final StringPath email = createString("email");

    public final ComparablePath<java.util.UUID> id = createComparable("id", java.util.UUID.class);

    public final ListPath<org.ssafy.respring.domain.challenge.vo.UserChallenge, org.ssafy.respring.domain.challenge.vo.QUserChallenge> joinedChallenges = this.<org.ssafy.respring.domain.challenge.vo.UserChallenge, org.ssafy.respring.domain.challenge.vo.QUserChallenge>createList("joinedChallenges", org.ssafy.respring.domain.challenge.vo.UserChallenge.class, org.ssafy.respring.domain.challenge.vo.QUserChallenge.class, PathInits.DIRECT2);

    public final ListPath<org.ssafy.respring.domain.book.vo.Book, org.ssafy.respring.domain.book.vo.QBook> myBooks = this.<org.ssafy.respring.domain.book.vo.Book, org.ssafy.respring.domain.book.vo.QBook>createList("myBooks", org.ssafy.respring.domain.book.vo.Book.class, org.ssafy.respring.domain.book.vo.QBook.class, PathInits.DIRECT2);

    public final StringPath password = createString("password");

    public final StringPath profileImage = createString("profileImage");

    public final ListPath<SocialAccount, QSocialAccount> socialAccounts = this.<SocialAccount, QSocialAccount>createList("socialAccounts", SocialAccount.class, QSocialAccount.class, PathInits.DIRECT2);

    public final StringPath socialId = createString("socialId");

    public final StringPath userNickname = createString("userNickname");

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

