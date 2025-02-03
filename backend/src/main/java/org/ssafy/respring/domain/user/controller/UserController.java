package org.ssafy.respring.domain.user.controller;

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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class UserController {
    UserService userService;
//    private final static UUID TEST_USERID = UUID.fromString("00000000-0000-0000-0000-000000000001");

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Void> signupUser(@Valid @RequestBody SignUpRequestDto signUpRequestDto) {
        userService.addUser(signUpRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequestDto loginRequestDto, HttpSession session,
                                      HttpServletResponse response) throws AuthenticationFailedException {
        LoginResponseDto loginResponseDto = userService.loginUser(loginRequestDto);

        session.setAttribute("userId", loginResponseDto.getUserId());
        session.setAttribute("userNickname", loginResponseDto.getUserNickname());

        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @GetMapping("/session")
    public ResponseEntity<Map<String, Object>> getSessionInfo(HttpSession session) {

        UUID userId = (UUID) session.getAttribute("userId");
        String userNickname = (String) session.getAttribute("userNickname");

        System.out.println(session.getId());

        Map<String, Object> sessionInfo = new HashMap<>();
        sessionInfo.put("userId", userId);
        sessionInfo.put("userNickname", userNickname);
        return ResponseEntity.status(HttpStatus.OK).body(sessionInfo);
    }
    //DB 확인용 테스트 코드입니다
    @GetMapping("/alluser")
    public ResponseEntity<List<String>> getAllUser() {
        List<User> list =userService.findAllUser();

        List<String> nicknames = list.stream()
                .map(User::getUserNickname)
                .toList();

        return ResponseEntity.status(HttpStatus.OK).body(nicknames);

    }
}





