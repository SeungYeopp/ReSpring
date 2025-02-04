package org.ssafy.respring.domain.subscribe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@AllArgsConstructor
public class SubscribedUserResponseDto {
    private UUID id;
    private String nickname;
    private String email;
    private String profileImage;
    private LocalDateTime createdAt;
}
