package org.ssafy.respring.domain.ai.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.util.LinkedHashMap;

//public record AICompileRequest (
//  @NotBlank String message){
//}

public record AICompileRequest(
        @NotBlank LinkedHashMap<String, String> content
) {
}

