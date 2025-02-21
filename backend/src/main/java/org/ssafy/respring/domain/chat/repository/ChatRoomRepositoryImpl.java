package org.ssafy.respring.domain.chat.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.chat.vo.ChatRoom;
import org.ssafy.respring.domain.chat.vo.QChatRoom;
import org.ssafy.respring.domain.chat.vo.QChatRoomUser;
import org.ssafy.respring.domain.user.vo.QUser;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;
import java.util.Optional;
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
        QChatRoomUser chatRoomUser = QChatRoomUser.chatRoomUser;
        QUser user = QUser.user;

        return queryFactory
                .selectFrom(chatRoom)
                .join(chatRoom.chatRoomUsers, chatRoomUser)
                .join(chatRoomUser.user, user)
                .where(user.id.eq(userId)
                        .and(chatRoomUser.isActive.isTrue())) //   나간 방 제외
                .fetch();
    }


    @Override
    public Optional<ChatRoom> findExactPrivateRoom(User user1, User user2) {
        QChatRoom chatRoom = QChatRoom.chatRoom;
        QChatRoomUser chatRoomUser = QChatRoomUser.chatRoomUser;

        ChatRoom result = queryFactory
                .selectFrom(chatRoom)
                .leftJoin(chatRoom.chatRoomUsers, chatRoomUser).fetchJoin() //   chatRoomUsers를 함께 조회
                .where(
                        chatRoom.isOpenChat.eq(false), //   1:1 채팅방 필터링
                        chatRoom.chatRoomUsers.any().user.eq(user1),
                        chatRoom.chatRoomUsers.any().user.eq(user2),
                        chatRoom.chatRoomUsers.size().eq(2) //   정확히 두 명만 포함된 방 찾기
                )
                .fetchOne();

        return Optional.ofNullable(result);
    }


}
