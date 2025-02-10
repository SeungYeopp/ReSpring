package org.ssafy.respring.domain.user.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.mail.AuthenticationFailedException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;

import java.util.*;

@RestController
@RequestMapping("/user")
@Tag(name = "User API", description = "유저 관련 API")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ 회원가입 (일반 로그인)
    @Operation(summary = "유저 회원가입 기능", description = "유저 회원가입 기능입니다.")
    @PostMapping("/signup")
    public ResponseEntity<Void> signupUser(@Valid @RequestBody SignUpRequestDto signUpRequestDto) {
        userService.addUser(signUpRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // ✅ 일반 로그인

    @Operation(summary = "유저 로그인 기능", description = "일반 로그인 기능입니다.")
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequestDto loginRequestDto, HttpSession session)
            throws AuthenticationFailedException {
        LoginResponseDto loginResponseDto = userService.loginUser(loginRequestDto);
        session.setAttribute("userId", loginResponseDto.getUserId());
        session.setAttribute("userNickname", loginResponseDto.getUserNickname());
        return ResponseEntity.ok().build();
    }

    // ✅ 로그인 상태 확인 (OAuth2 + 일반 로그인 통합)
    @Operation(summary = "회원정보 조회 기능", description = "세션의 정보로 정보를 조회하는 기능입니다")
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getUserProfile(HttpSession session) {
        Object userId = session.getAttribute("userId");
        Object userNickname = session.getAttribute("userNickname");

        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "nickname", userNickname
        ));
    }

    // ✅ 로그아웃 (OAuth2 + 일반 로그인 통합)
    @Operation(summary = "유저 로그아웃 기능", description = "세션을 만료시키는 기능입니다.")
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }
}
