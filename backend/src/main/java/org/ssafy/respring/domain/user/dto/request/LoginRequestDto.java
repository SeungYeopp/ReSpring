package org.ssafy.respring.domain.user.dto.request;

public class LoginRequestDto {
    private String email; //유저 닉네임
    private String password; //유저 패스워드

    public LoginRequestDto() {
        // TODO Auto-generated constructor stub
    }

    public LoginRequestDto(String email, String password) {
        super();
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }
    public String getPassword(){
        return password;
    }

}
