package org.ssafy.respring.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDto {
    private UUID userId;
    private String userNickname;
    private String profileImageUrl;

}
