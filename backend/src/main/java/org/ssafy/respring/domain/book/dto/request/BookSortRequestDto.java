package org.ssafy.respring.domain.book.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BookSortRequestDto {
    private String sortBy;
    private boolean ascending;
    private Long lastValue;
    private LocalDateTime lastCreatedAt;
    private Long lastId;
    private int size;
}
