package org.ssafy.respring.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
}
