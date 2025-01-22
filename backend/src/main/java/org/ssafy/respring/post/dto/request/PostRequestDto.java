package org.ssafy.respring.post.dto.request;

import lombok.Data;
import org.ssafy.respring.post.vo.Category;

import java.util.UUID;

@Data
public class PostRequestDto {
    private UUID userId;
    private String title;
    private String content;
    private Category category;
}
