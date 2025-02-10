package org.ssafy.respring.domain.challenge.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChallengeLikes is a Querydsl query type for ChallengeLikes
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChallengeLikes extends EntityPathBase<ChallengeLikes> {

    private static final long serialVersionUID = 1687886819L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QChallengeLikes challengeLikes = new QChallengeLikes("challengeLikes");

    public final QChallenge challenge;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final org.ssafy.respring.domain.user.vo.QUser user;

    public QChallengeLikes(String variable) {
        this(ChallengeLikes.class, forVariable(variable), INITS);
    }

    public QChallengeLikes(Path<? extends ChallengeLikes> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QChallengeLikes(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QChallengeLikes(PathMetadata metadata, PathInits inits) {
        this(ChallengeLikes.class, metadata, inits);
    }

    public QChallengeLikes(Class<? extends ChallengeLikes> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.challenge = inits.isInitialized("challenge") ? new QChallenge(forProperty("challenge"), inits.get("challenge")) : null;
        this.user = inits.isInitialized("user") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("user")) : null;
    }

}

