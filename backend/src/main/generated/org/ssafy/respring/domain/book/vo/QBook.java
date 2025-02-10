package org.ssafy.respring.domain.book.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBook is a Querydsl query type for Book
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBook extends EntityPathBase<Book> {

    private static final long serialVersionUID = -543980679L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBook book = new QBook("book");

    public final org.ssafy.respring.domain.user.vo.QUser author;

    public final SetPath<BookLikes, QBookLikes> bookLikes = this.<BookLikes, QBookLikes>createSet("bookLikes", BookLikes.class, QBookLikes.class, PathInits.DIRECT2);

    public final ListPath<org.ssafy.respring.domain.comment.vo.Comment, org.ssafy.respring.domain.comment.vo.QComment> comments = this.<org.ssafy.respring.domain.comment.vo.Comment, org.ssafy.respring.domain.comment.vo.QComment>createList("comments", org.ssafy.respring.domain.comment.vo.Comment.class, org.ssafy.respring.domain.comment.vo.QComment.class, PathInits.DIRECT2);

    public final StringPath coverImage = createString("coverImage");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final ListPath<Long, NumberPath<Long>> storyIds = this.<Long, NumberPath<Long>>createList("storyIds", Long.class, NumberPath.class, PathInits.DIRECT2);

    public final SetPath<String, StringPath> tags = this.<String, StringPath>createSet("tags", String.class, StringPath.class, PathInits.DIRECT2);

    public final StringPath title = createString("title");

    public final DateTimePath<java.time.LocalDateTime> updatedAt = createDateTime("updatedAt", java.time.LocalDateTime.class);

    public final SetPath<BookViews, QBookViews> views = this.<BookViews, QBookViews>createSet("views", BookViews.class, QBookViews.class, PathInits.DIRECT2);

    public QBook(String variable) {
        this(Book.class, forVariable(variable), INITS);
    }

    public QBook(Path<? extends Book> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBook(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBook(PathMetadata metadata, PathInits inits) {
        this(Book.class, metadata, inits);
    }

    public QBook(Class<? extends Book> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.author = inits.isInitialized("author") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("author")) : null;
    }

}

