package org.ssafy.respring.domain.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.AuthenticationFailedException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.service.AuthService;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "일반 로그인", description = "세션을 활용한 일반 로그인 기능")
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequestDto loginRequestDto, HttpSession session)
            throws AuthenticationFailedException {
        LoginResponseDto loginResponseDto = authService.loginUser(loginRequestDto);
        session.setAttribute("userId", loginResponseDto.getUserId());
        session.setAttribute("userNickname", loginResponseDto.getUserNickname());
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @Operation(summary = "소셜 로그인", description = "OAuth2를 활용한 소셜 로그인 기능 (Kakao, Google 등)")
    @GetMapping("/oauth/login")
    public ResponseEntity<Void> socialLogin(@AuthenticationPrincipal OAuth2User oauth2User, HttpSession session) {
        if (oauth2User == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String provider = "GOOGLE"; // Kakao라면 "KAKAO"로 변경
        LoginResponseDto responseDto = authService.processOAuthLogin(oauth2User, provider);

        session.setAttribute("userId", responseDto.getUserId());
        session.setAttribute("userNickname", responseDto.getUserNickname());

        return ResponseEntity.status(HttpStatus.OK).build();
    }



    @Operation(summary = "로그아웃", description = "세션을 만료시키는 로그아웃 기능")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
