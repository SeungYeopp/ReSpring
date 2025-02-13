package org.ssafy.respring.domain.challenge.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.UUID;

@Getter
@AllArgsConstructor
public class ParticipantInfoDto {
    private String userName;
    private String profileImage;
}
