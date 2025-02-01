package org.ssafy.respring.domain.user.dto.request;

public class SignUpRequestDto {
    private String userNickname;
    private String email;
    private String password;

    public SignUpRequestDto() {
    }

    public SignUpRequestDto(String userNickname, String email, String password) {
        this.userNickname = userNickname;
        this.email = email;
        this.password = password;
    }

    public String getUserNickname() {
        return userNickname;
    }
    public String getEmail() {
        return email;
    }
    public String getPassword() {
        return password;
    }

}
