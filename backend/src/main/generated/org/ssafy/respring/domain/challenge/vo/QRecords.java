package org.ssafy.respring.domain.challenge.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRecords is a Querydsl query type for Records
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRecords extends EntityPathBase<Records> {

    private static final long serialVersionUID = -34353480L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRecords records = new QRecords("records");

    public final QChallenge challenge;

    public final NumberPath<Integer> currentStreak = createNumber("currentStreak", Integer.class);

    public final DatePath<java.time.LocalDate> endDate = createDate("endDate", java.time.LocalDate.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isSuccess = createBoolean("isSuccess");

    public final DatePath<java.time.LocalDate> lastUpdatedDate = createDate("lastUpdatedDate", java.time.LocalDate.class);

    public final NumberPath<Integer> longestStreak = createNumber("longestStreak", Integer.class);

    public final ComparablePath<java.util.UUID> recordKey = createComparable("recordKey", java.util.UUID.class);

    public final DatePath<java.time.LocalDate> recordStartDate = createDate("recordStartDate", java.time.LocalDate.class);

    public final DatePath<java.time.LocalDate> startDate = createDate("startDate", java.time.LocalDate.class);

    public final NumberPath<Integer> successCount = createNumber("successCount", Integer.class);

    public final NumberPath<Integer> totalDays = createNumber("totalDays", Integer.class);

    public final org.ssafy.respring.domain.user.vo.QUser user;

    public QRecords(String variable) {
        this(Records.class, forVariable(variable), INITS);
    }

    public QRecords(Path<? extends Records> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRecords(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRecords(PathMetadata metadata, PathInits inits) {
        this(Records.class, metadata, inits);
    }

    public QRecords(Class<? extends Records> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.challenge = inits.isInitialized("challenge") ? new QChallenge(forProperty("challenge"), inits.get("challenge")) : null;
        this.user = inits.isInitialized("user") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("user")) : null;
    }

}

