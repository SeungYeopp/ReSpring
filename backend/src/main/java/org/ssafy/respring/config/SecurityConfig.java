package org.ssafy.respring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
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
                        // Swagger 경로 허용
                        .requestMatchers(
                                "/swagger-ui/**",       // Swagger UI
                                "/v3/api-docs/**",      // OpenAPI 문서
                                "/swagger-resources/**", // Swagger 리소스
                                "/webjars/**",           // Swagger WebJar
                                "/post/**",
                                "/events/**"
                        ).permitAll()
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                // 폼 로그인 비활성화
                .formLogin(form -> form.disable());

        return http.build();
    }
}

