package org.ssafy.respring.domain.user.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SignUpRequestDto {
    private String userNickname;
    private String email;
    private String password;
    private String provider;
}
