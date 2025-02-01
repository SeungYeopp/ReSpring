package org.ssafy.respring.domain.user.mapper;

import org.springframework.stereotype.Component;
import org.ssafy.respring.domain.user.dto.request.SignUpRequestDto;
import org.ssafy.respring.domain.user.dto.response.LoginResponseDto;
import org.ssafy.respring.domain.user.vo.User;

@Component
public class UserMapper {
    // 회원가입으로 유저 객체 생성
    public User dtoToEntity(SignUpRequestDto request) {
        return new User(request.getPassword(),
                request.getUserNickname(),
                request.getEmail()
        );
    }

    // 유저로 로그인 객체 생성
    public LoginResponseDto entityToDto(User user) {
        return new LoginResponseDto(
                user.getId(),
                user.getUserNickname()
        );
    }}