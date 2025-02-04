package org.ssafy.respring.domain.user.dto.response;

import java.util.UUID;

public class LoginResponseDto {
    private UUID userId;
    private String userNickname;

    public LoginResponseDto() {
        // TODO Auto-generated constructor stub
    }

    public LoginResponseDto(UUID userId, String userNickname) {
        super();
        this.userId = userId;
        this.userNickname = userNickname;
    }

    public String getUserNickname() {
        return userNickname;
    }

    public UUID getUserId() {
        return userId;
    }

}
