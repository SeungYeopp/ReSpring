package org.ssafy.respring.domain.chat.vo;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChatRoom is a Querydsl query type for ChatRoom
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChatRoom extends EntityPathBase<ChatRoom> {

    private static final long serialVersionUID = 1848035026L;

    public static final QChatRoom chatRoom = new QChatRoom("chatRoom");

    public final ListPath<ChatRoomUser, QChatRoomUser> chatRoomUsers = this.<ChatRoomUser, QChatRoomUser>createList("chatRoomUsers", ChatRoomUser.class, QChatRoomUser.class, PathInits.DIRECT2);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isMentoring = createBoolean("isMentoring");

    public final BooleanPath isOpenChat = createBoolean("isOpenChat");

    public final ComparablePath<java.util.UUID> mentorId = createComparable("mentorId", java.util.UUID.class);

    public final StringPath name = createString("name");

    public QChatRoom(String variable) {
        super(ChatRoom.class, forVariable(variable));
    }

    public QChatRoom(Path<? extends ChatRoom> path) {
        super(path.getType(), path.getMetadata());
    }

    public QChatRoom(PathMetadata metadata) {
        super(ChatRoom.class, metadata);
    }

}

