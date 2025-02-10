package org.ssafy.respring.domain.book.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBookLikes is a Querydsl query type for BookLikes
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBookLikes extends EntityPathBase<BookLikes> {

    private static final long serialVersionUID = 1107366851L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBookLikes bookLikes = new QBookLikes("bookLikes");

    public final QBook book;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> likedAt = createDateTime("likedAt", java.time.LocalDateTime.class);

    public final org.ssafy.respring.domain.user.vo.QUser user;

    public QBookLikes(String variable) {
        this(BookLikes.class, forVariable(variable), INITS);
    }

    public QBookLikes(Path<? extends BookLikes> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBookLikes(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBookLikes(PathMetadata metadata, PathInits inits) {
        this(BookLikes.class, metadata, inits);
    }

    public QBookLikes(Class<? extends BookLikes> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.book = inits.isInitialized("book") ? new QBook(forProperty("book"), inits.get("book")) : null;
        this.user = inits.isInitialized("user") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("user")) : null;
    }

}

