package org.ssafy.respring.domain.notification.vo;

public enum NotificationType {
    COMMENT,  // ✅ 내 콘텐츠(게시글, 자서전)에 대한 댓글
    REPLY,    // ✅ 내 댓글에 대한 대댓글
    LIKE,     // ✅ 내 콘텐츠(게시글, 자서전, 챌린지)에 대한 좋아요
    FOLLOW,    // ✅ 나를 구독한 사람이 생긴 경우
    CHAT
}