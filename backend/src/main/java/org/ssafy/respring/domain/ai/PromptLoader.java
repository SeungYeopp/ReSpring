package org.ssafy.respring.domain.ai;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.EnumMap;
import java.util.Map;

import static org.ssafy.respring.domain.ai.PromptType.AUTOBIOGRAPHY;

@Component
@Slf4j
public class PromptLoader {
    @Value("classpath:prompts/system-AI-compile.st")
    private Resource compileAIPromptResource;

    private Map<PromptType, Resource> systemPromptResources;

    @PostConstruct
    public void initPromptResources() {
        systemPromptResources = new EnumMap<>(PromptType.class);
        systemPromptResources.put(AUTOBIOGRAPHY, compileAIPromptResource);
    }

    public String getSystemPromptResource(PromptType promptType) {
        try {
            return new String(FileCopyUtils.copyToByteArray(systemPromptResources.get(promptType).getInputStream()), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load system prompt template", e);
        }
    }
}
