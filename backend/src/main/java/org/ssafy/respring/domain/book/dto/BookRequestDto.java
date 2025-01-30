package org.ssafy.respring.domain.book.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class BookRequestDto {
	private UUID userId;
	private String title;
	private String content;
	private String coverImg;
	private String tag;
	private Long likes = 0L;
	private Long view = 0L;
}
