package org.ssafy.respring.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ssafy.respring.domain.user.vo.SocialAccount;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    Optional<SocialAccount> findByProviderAndSocialId(String provider, String socialId);
}
