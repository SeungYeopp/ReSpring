package org.ssafy.respring.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDto {
    private String userNickname;
    private String email;
    private String password;
    private MultipartFile image;
    private String provider;
}
