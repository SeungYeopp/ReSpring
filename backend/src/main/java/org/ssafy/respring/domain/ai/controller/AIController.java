package org.ssafy.respring.domain.ai.controller;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.openai.OpenAiChatModel;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.ssafy.respring.domain.ai.PromptLoader;
import org.ssafy.respring.domain.ai.PromptType;
import org.ssafy.respring.domain.ai.dto.response.AIResponse;
import org.ssafy.respring.domain.ai.dto.request.AICompileRequest;

import static org.ssafy.respring.domain.ai.PromptType.*;

@RequiredArgsConstructor
@RequestMapping("/books/ai-compile")
@RestController
public class AIController {
	private final OpenAiChatModel chatModel;
	private final PromptLoader promptLoader;

	@PostMapping
	// @UserAccess
	public ResponseEntity<AIResponse> compileAI(
	  // @AuthenticationPrincipal AccessContext accessContext,
	  @Valid@RequestBody final AICompileRequest compileRequest) {
		return ResponseEntity.ok().body(AIResponse.from(getResponse(AUTOBIOGRAPHY, compileRequest.message())));
	}

	private String getResponse(final PromptType promptType, final String message) {
		SystemMessage systemMessage = new SystemMessage(promptLoader.getSystemPromptResource(promptType));
		if(message == null){
			return chatModel.call(systemMessage);
		}
		UserMessage userMessage = new UserMessage(message);
		return chatModel.call(systemMessage, userMessage);
	}
}