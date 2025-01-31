package org.ssafy.respring.domain.chat.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.QChatRoom;
import org.ssafy.respring.domain.user.vo.QUser;

import java.util.List;
import java.util.UUID;

@Repository
public class ChatRoomRepositoryImpl implements ChatRoomRepositoryQuerydsl {
    private final JPAQueryFactory queryFactory;


    public ChatRoomRepositoryImpl(EntityManager em) {
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public List<ChatRoom> findRoomsByUserId(UUID userId) {
        QChatRoom chatRoom = QChatRoom.chatRoom;
        QUser user = QUser.user;

        return queryFactory
                .selectFrom(chatRoom)
                .join(chatRoom.users, user)
                .where(user.id.eq(userId))
                .fetch();
    }
}
