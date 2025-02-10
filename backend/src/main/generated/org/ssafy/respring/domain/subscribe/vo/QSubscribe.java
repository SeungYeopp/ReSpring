package org.ssafy.respring.domain.subscribe.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSubscribe is a Querydsl query type for Subscribe
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubscribe extends EntityPathBase<Subscribe> {

    private static final long serialVersionUID = -847653191L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSubscribe subscribe = new QSubscribe("subscribe");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final org.ssafy.respring.domain.user.vo.QUser subscribedTo;

    public final org.ssafy.respring.domain.user.vo.QUser subscriber;

    public QSubscribe(String variable) {
        this(Subscribe.class, forVariable(variable), INITS);
    }

    public QSubscribe(Path<? extends Subscribe> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSubscribe(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSubscribe(PathMetadata metadata, PathInits inits) {
        this(Subscribe.class, metadata, inits);
    }

    public QSubscribe(Class<? extends Subscribe> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.subscribedTo = inits.isInitialized("subscribedTo") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("subscribedTo")) : null;
        this.subscriber = inits.isInitialized("subscriber") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("subscriber")) : null;
    }

}

