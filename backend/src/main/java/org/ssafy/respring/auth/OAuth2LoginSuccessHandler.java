package org.ssafy.respring.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.ssafy.respring.domain.user.vo.User;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthService authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String provider = determineProvider(authentication);

        User user = authService.processOAuthLogin(provider, oauth2User);

        HttpSession session = request.getSession();
        session.setAttribute("userId", user.getId());
        session.setAttribute("nickname", user.getUserNickname());

        response.sendRedirect("/login-success");
    }

    private String determineProvider(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(Object::toString)
                .filter(auth -> auth.contains("KAKAO") || auth.contains("GOOGLE"))
                .findFirst()
                .orElse("UNKNOWN");
    }
}
