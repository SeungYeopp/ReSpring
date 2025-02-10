package org.ssafy.respring.domain.book.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBookViews is a Querydsl query type for BookViews
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBookViews extends EntityPathBase<BookViews> {

    private static final long serialVersionUID = 1116596853L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBookViews bookViews = new QBookViews("bookViews");

    public final QBook book;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final org.ssafy.respring.domain.user.vo.QUser user;

    public QBookViews(String variable) {
        this(BookViews.class, forVariable(variable), INITS);
    }

    public QBookViews(Path<? extends BookViews> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBookViews(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBookViews(PathMetadata metadata, PathInits inits) {
        this(BookViews.class, metadata, inits);
    }

    public QBookViews(Class<? extends BookViews> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new QBook(forProperty("book"), inits.get("book")) : null;
        this.user = inits.isInitialized("user") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("user")) : null;
    }

}

