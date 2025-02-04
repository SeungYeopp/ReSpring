package org.ssafy.respring.domain.subscribe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.ssafy.respring.domain.subscribe.vo.Subscribe;
import org.ssafy.respring.domain.user.vo.User;

import java.util.List;


@Repository
public interface SubscribeRepository extends JpaRepository<Subscribe, Long> {
    // ✅ 특정 사용자가 구독한 사람 목록 조회
    List<Subscribe> findBySubscriber(User subscriber);

    // ✅ 특정 사용자가 특정 사용자를 구독하고 있는지 확인
    boolean existsBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);

    // ✅ 구독 해제
    void deleteBySubscriberAndSubscribedTo(User subscriber, User subscribedTo);
}