package org.ssafy.respring.domain.user.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.ssafy.respring.domain.user.repository.UserRepository;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final HttpSession session;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase();
        String email = extractEmail(provider, oauth2User);
        String nickname = extractNickname(provider, oauth2User);
        String profileImage = "public/placeholder_profilepic.png";

        if (email == null) {
            throw new IllegalArgumentException("OAuth provider did not return an email.");
        }

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUserNickname(nickname);
            newUser.setProfileImage(profileImage);
            newUser.setProvider(provider);

            User savedUser = userRepository.save(newUser);

            session.setAttribute("userId", savedUser.getId());
            session.setAttribute("userNickname", savedUser.getUserNickname());
            session.setAttribute("userProfileImage", savedUser.getProfileImage());


            System.out.println("OAuth 로그인 성공 - 사용자 ID: " + newUser.getId());
            System.out.println("세션 저장된 userId: " + session.getAttribute("userId"));
            System.out.println("세션 저장된 userNickname: " + session.getAttribute("userNickname"));


            return savedUser;
        });

        session.setAttribute("userId", user.getId());
        session.setAttribute("userNickname", user.getUserNickname());
        session.setAttribute("userProfileImage", user.getProfileImage());

        System.out.println("OAuth 로그인 성공 - 사용자 ID: " + user.getId());
        System.out.println("세션 저장된 userId: " + session.getAttribute("userId"));
        System.out.println("세션 저장된 userNickname: " + session.getAttribute("userNickname"));




        return oauth2User;
    }

    private String extractEmail(String provider, OAuth2User oauth2User) {
        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoAccount = oauth2User.getAttribute("kakao_account");
            return (kakaoAccount != null) ? (String) kakaoAccount.get("email") : null;
        }
        return oauth2User.getAttribute("email");
    }

    private String extractNickname(String provider, OAuth2User oauth2User) {
        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoProfile = oauth2User.getAttribute("kakao_account");
            if (kakaoProfile != null) {
                Map<String, Object> profile = (Map<String, Object>) kakaoProfile.get("profile");
                return (profile != null) ? (String) profile.get("nickname") : "Unknown User";
            }
        }
        return oauth2User.getAttribute("name");
    }

    private String extractProfileImage(String provider, OAuth2User oauth2User) {
        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoProfile = oauth2User.getAttribute("kakao_account");
            if (kakaoProfile != null) {
                Map<String, Object> profile = (Map<String, Object>) kakaoProfile.get("profile");
                return (profile != null) ? (String) profile.get("profile_image_url") : "https://i.imgur.com/QbLhsD7.png";
            }
        }
        return oauth2User.getAttribute("picture");
    }
}
