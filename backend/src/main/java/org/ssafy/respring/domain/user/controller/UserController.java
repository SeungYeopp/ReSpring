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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.ssafy.respring.domain.image.service.ImageService;
import org.ssafy.respring.domain.user.dto.request.LoginRequestDto;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.service.AuthService;
import org.ssafy.respring.domain.user.service.UserService;
import org.ssafy.respring.domain.user.vo.User;

import java.util.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "User API", description = "유저 관련 API")
public class UserController {
    private final UserService userService;
    private final ImageService imageService;
    private final AuthService authService;

    @Operation(summary = "유저 회원가입 기능", description = "유저 회원가입 기능입니다.")
    @PostMapping(value = "/signup", consumes = {"multipart/form-data"})
    public ResponseEntity<Void> signupUser(
            @Valid @RequestPart("signUpRequestDto") SignUpRequestDto signUpRequestDto,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        userService.addUser(signUpRequestDto,image);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


    @Operation(summary = "회원정보 조회 기능", description = "세션을 활용하여 회원 정보를 조회합니다.")
    @GetMapping("/me")
    public ResponseEntity<LoginResponseDto> getUserProfile(HttpSession session) {
        UUID userId = (UUID) session.getAttribute("userId");
        String userNickname = (String) session.getAttribute("userNickname");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String imageUrl = (String) session.getAttribute("userProfileImage");
        String presignedUrl = imageService.generatePresignedUrl(imageUrl);
        LoginResponseDto responseDto = new LoginResponseDto(userId, userNickname, presignedUrl);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }



    @Operation(summary = "특정 유저 조회 기능", description = "유저 닉네임으로 해당 유저의 정보를 조회합니다.")
    @GetMapping("/user/profile/{nickname}")
    public ResponseEntity<LoginResponseDto> getUserProfile(@PathVariable String nickname) {
        User user = userService.findByNickname(nickname);

        LoginResponseDto responseDto = authService.createResponseDto(user);
        return ResponseEntity.status(HttpStatus.OK).body(responseDto);
    }
}
