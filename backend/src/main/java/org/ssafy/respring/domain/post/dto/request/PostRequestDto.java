package org.ssafy.respring.domain.post.dto.request;

import lombok.Data;
import org.ssafy.respring.domain.post.vo.Category;

import java.util.List;
import java.util.UUID;

@Data
public class PostRequestDto {
    private String title;
    private String content;
    private Category category;
}
