package org.ssafy.respring.domain.ai.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AICompileRequest (
  @NotBlank String message){
}
