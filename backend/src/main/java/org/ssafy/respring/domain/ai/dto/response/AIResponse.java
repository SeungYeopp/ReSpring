package org.ssafy.respring.domain.ai.dto.response;

public record AIResponse(String response) {
	public static AIResponse from(String response){
		return new AIResponse(response);
	}
}
