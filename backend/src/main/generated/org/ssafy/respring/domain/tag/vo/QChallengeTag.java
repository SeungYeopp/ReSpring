package org.ssafy.respring.domain.tag.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChallengeTag is a Querydsl query type for ChallengeTag
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChallengeTag extends EntityPathBase<ChallengeTag> {

    private static final long serialVersionUID = -38034760L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QChallengeTag challengeTag = new QChallengeTag("challengeTag");

    public final org.ssafy.respring.domain.challenge.vo.QChallenge challenge;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QTag tag;

    public QChallengeTag(String variable) {
        this(ChallengeTag.class, forVariable(variable), INITS);
    }

    public QChallengeTag(Path<? extends ChallengeTag> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QChallengeTag(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QChallengeTag(PathMetadata metadata, PathInits inits) {
        this(ChallengeTag.class, metadata, inits);
    }

    public QChallengeTag(Class<? extends ChallengeTag> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.challenge = inits.isInitialized("challenge") ? new org.ssafy.respring.domain.challenge.vo.QChallenge(forProperty("challenge"), inits.get("challenge")) : null;
        this.tag = inits.isInitialized("tag") ? new QTag(forProperty("tag")) : null;
    }

}

