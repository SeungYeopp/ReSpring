package org.ssafy.respring.domain.post.dto.request;

import lombok.Data;
import org.ssafy.respring.domain.post.vo.Category;

@Data
public class PostRequestDto {
    private String title;
    private String content;
    private Category category;
}
