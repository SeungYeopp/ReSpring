package org.ssafy.respring.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;
import org.ssafy.respring.domain.user.vo.SocialAccount;
import org.ssafy.respring.domain.user.repository.SocialAccountRepository;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final SocialAccountRepository socialAccountRepository;

    public User processOAuthLogin(String provider, OAuth2User oauth2User) {
        String email = extractEmail(provider, oauth2User.getAttributes());
        String socialId = extractSocialId(provider, oauth2User.getAttributes());

        Optional<SocialAccount> existingAccount = socialAccountRepository.findByProviderAndSocialId(provider, socialId);

        if (existingAccount.isPresent()) {
            return existingAccount.get().getUser();
        }

        if (email == null) {
            email = provider + "_" + socialId + "@social.com";
        }

        User user = userService.findOrCreateUserBySocialLogin(provider, email, socialId, oauth2User);
        SocialAccount socialAccount = new SocialAccount(user, provider, socialId, null, null, LocalDateTime.now());

        socialAccountRepository.save(socialAccount);

        return user;
    }

    private String extractEmail(String provider, Map<String, Object> attributes) {
        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            return (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;
        } else if ("GOOGLE".equalsIgnoreCase(provider)) {
            return (String) attributes.get("email");
        }
        return null;
    }

    private String extractSocialId(String provider, Map<String, Object> attributes) {
        if ("KAKAO".equalsIgnoreCase(provider)) {
            return attributes.get("id").toString();
        } else if ("GOOGLE".equalsIgnoreCase(provider)) {
            return (String) attributes.get("sub");
        }
        return null;
    }
}
