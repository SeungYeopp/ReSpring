package org.ssafy.respring.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        // 제공자(Google, Kakao) 구분
        String provider = authentication.getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("UNKNOWN");

        // 카카오는 email이 kakao_account.email 안에 있음
        Map<String, Object> attributes = oauth2User.getAttributes();
        String email = null;
        String socialId = null;

        if ("KAKAO".equalsIgnoreCase(provider)) {
            Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
            if (kakaoAccount != null) {
                email = (String) kakaoAccount.get("email");
            }
            socialId = attributes.get("id").toString(); // 카카오는 `id`가 고유 식별자
        } else {
            email = (String) attributes.get("email"); // 구글의 경우 email 직접 제공
            socialId = (String) attributes.get("sub"); // 구글의 고유 ID (sub)
        }

        System.out.println("OAuth 로그인 성공: " + provider + " - " + email + " (ID: " + socialId + ")");

        // 이메일이 없으면 소셜 ID를 대신 사용 (카카오에서 이메일 미제공 시 대비)
        if (email == null) {
            email = provider + "_" + socialId + "@social.com"; // 임시 이메일 생성
        }

        // 유저 찾기 or 생성
        User user = userService.findOrCreateUserBySocialLogin(provider, email, socialId, oauth2User);

        // 세션 저장
        request.getSession().setAttribute("userId", user.getUserId());
        request.getSession().setAttribute("nickname", user.getUserNickname());

        // JSON 응답 반환
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("success", true);
        responseBody.put("userId", user.getUserId());
        responseBody.put("nickname", user.getUserNickname());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(responseBody));
    }
}
