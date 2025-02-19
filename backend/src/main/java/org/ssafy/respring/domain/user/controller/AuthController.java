package org.ssafy.respring.domain.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.AuthenticationFailedException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.service.AuthService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Auth API", description = "로그인 관련 API")
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

    @Operation(summary = "로그아웃", description = "세션을 만료시키는 로그아웃 기능")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
