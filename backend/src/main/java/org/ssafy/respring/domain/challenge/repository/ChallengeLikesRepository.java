package org.ssafy.respring.domain.challenge.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.challenge.vo.ChallengeLikes;

public interface ChallengeLikesRepository extends JpaRepository<ChallengeLikes, Long>, ChallengeLikesQueryDsl {
}
