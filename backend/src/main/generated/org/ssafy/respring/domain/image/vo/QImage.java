package org.ssafy.respring.domain.image.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QImage is a Querydsl query type for Image
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QImage extends EntityPathBase<Image> {

    private static final long serialVersionUID = -1016260263L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QImage image = new QImage("image");

    public final NumberPath<Long> imageId = createNumber("imageId", Long.class);

    public final org.ssafy.respring.domain.post.vo.QPost post;

    public final StringPath s3Key = createString("s3Key");

    public final org.ssafy.respring.domain.story.vo.QStory story;

    public QImage(String variable) {
        this(Image.class, forVariable(variable), INITS);
    }

    public QImage(Path<? extends Image> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QImage(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QImage(PathMetadata metadata, PathInits inits) {
        this(Image.class, metadata, inits);
    }

    public QImage(Class<? extends Image> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.post = inits.isInitialized("post") ? new org.ssafy.respring.domain.post.vo.QPost(forProperty("post"), inits.get("post")) : null;
        this.story = inits.isInitialized("story") ? new org.ssafy.respring.domain.story.vo.QStory(forProperty("story"), inits.get("story")) : null;
    }

}

