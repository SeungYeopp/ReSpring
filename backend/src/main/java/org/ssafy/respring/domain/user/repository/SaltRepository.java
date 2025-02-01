package org.ssafy.respring.domain.user.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.user.vo.Salt;

import java.util.UUID;

public interface SaltRepository extends JpaRepository<Salt, UUID> {
}
