package org.ssafy.respring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 설정 (비활성화)
                .csrf(csrf -> csrf.disable())
                // 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/**"
                        ).permitAll()
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                .oauth2Login(Customizer.withDefaults()) // ✅ OAuth2 로그인 자동 설정

                // 폼 로그인 비활성화
                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
        return new DefaultOAuth2UserService(); // 기본 OAuth2 유저 서비스 사용
    }

}

