package org.ssafy.respring.domain.chat.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChatRoomUser is a Querydsl query type for ChatRoomUser
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChatRoomUser extends EntityPathBase<ChatRoomUser> {

    private static final long serialVersionUID = -586453571L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QChatRoomUser chatRoomUser = new QChatRoomUser("chatRoomUser");

    public final QChatRoom chatRoom;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isActive = createBoolean("isActive");

    public final org.ssafy.respring.domain.user.vo.QUser user;

    public QChatRoomUser(String variable) {
        this(ChatRoomUser.class, forVariable(variable), INITS);
    }

    public QChatRoomUser(Path<? extends ChatRoomUser> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QChatRoomUser(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QChatRoomUser(PathMetadata metadata, PathInits inits) {
        this(ChatRoomUser.class, metadata, inits);
    }

    public QChatRoomUser(Class<? extends ChatRoomUser> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.chatRoom = inits.isInitialized("chatRoom") ? new QChatRoom(forProperty("chatRoom")) : null;
        this.user = inits.isInitialized("user") ? new org.ssafy.respring.domain.user.vo.QUser(forProperty("user")) : null;
    }

}

