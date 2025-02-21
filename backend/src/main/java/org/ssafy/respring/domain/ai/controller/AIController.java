package org.ssafy.respring.domain.ai.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.ssafy.respring.domain.ai.PromptLoader;
import org.ssafy.respring.domain.ai.PromptType;
import org.ssafy.respring.domain.ai.dto.request.AICompileRequest;
import org.ssafy.respring.domain.ai.dto.response.AIResponse;

import java.util.LinkedHashMap;

import static org.ssafy.respring.domain.ai.PromptType.AUTOBIOGRAPHY;

@RequiredArgsConstructor
@RequestMapping("/books/ai-compile")
@RestController
@Tag(name = "AI API", description = "AI 관련 API")
public class AIController {
    private final OpenAiChatModel chatModel;
    private final PromptLoader promptLoader;
    private final ObjectMapper objectMapper; // JSON 변환용

    @PostMapping
    @Operation(summary = "AI 자동 엮기 기능", description = "선택된 글 조각 기반으로 자동으로 봄날의 서 하나를 반환합니다.")
    public ResponseEntity<AIResponse> compileAI(
            @Valid @RequestBody final AICompileRequest compileRequest) {
        return ResponseEntity.ok().body(AIResponse.from(getResponse(AUTOBIOGRAPHY, compileRequest.content())));
    }

    private String getResponse(final PromptType promptType, final LinkedHashMap<String, String> message) {
        SystemMessage systemMessage = new SystemMessage(promptLoader.getSystemPromptResource(promptType));
        if (message == null) {
            return chatModel.call(systemMessage);
        }
        try {
            // LinkedHashMap을 JSON 문자열로 변환
            String jsonMessage = objectMapper.writeValueAsString(message);
            UserMessage userMessage = new UserMessage(jsonMessage);
            return chatModel.call(systemMessage, userMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert message to JSON", e);
        }
    }

    private String getResponse(final PromptType promptType, final String message) {
        SystemMessage systemMessage = new SystemMessage(promptLoader.getSystemPromptResource(promptType));
        if (message == null) {
            return chatModel.call(systemMessage);
        }
        UserMessage userMessage = new UserMessage(message);
        return chatModel.call(systemMessage, userMessage);
    }
}