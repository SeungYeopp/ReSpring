package org.ssafy.respring.auth;

import jakarta.mail.AuthenticationFailedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;
import org.springframework.beans.factory.annotation.Value;
import java.util.Map;

//로그인 컨트롤러의 역할입니다
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    private static final String BASE_URL = "http://i12a307.p.ssafy:8080"; // 로컬 환경에서 사용

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequestDto loginRequestDto, HttpSession session)
            throws AuthenticationFailedException {
        LoginResponseDto loginResponseDto = userService.loginUser(loginRequestDto);

        session.setAttribute("userId", loginResponseDto.getUserId());
        session.setAttribute("userNickname", loginResponseDto.getUserNickname());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/login/kakao")
    public ResponseEntity<Void> kakaoLogin() {
        return ResponseEntity.status(302) // HTTP 302 리다이렉트
                .header("Location", BASE_URL + "/oauth2/authorization/kakao") // ✅ 수정된 카카오 로그인 URL
                .build();
    }

    @GetMapping("/login/google")
    public ResponseEntity<Void> googleLogin() {
        return ResponseEntity.status(302)
                .header("Location", BASE_URL + "/oauth2/authorization/google") // ✅ 수정된 구글 로그인 URL
                .build();
    }


    @GetMapping("/oauth2/success")
    public ResponseEntity<Void> socialLoginSuccess(HttpServletRequest request, Authentication authentication) {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        String provider = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("UNKNOWN");

        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = null;
        String socialId = null;

        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email");
            }
            socialId = attributes.get("id").toString();
        } else {
            email = (String) attributes.get("email");
            socialId = (String) attributes.get("sub");
        }

        if (email == null) {
            email = provider + "_" + socialId + "@social.com";
        }

        // 유저 조회 or 생성
        User user = userService.findOrCreateUserBySocialLogin(provider, email, socialId, oauth2User);

        HttpSession session = request.getSession();
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("userNickname", user.getUserNickname());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok().build();
    }
}
