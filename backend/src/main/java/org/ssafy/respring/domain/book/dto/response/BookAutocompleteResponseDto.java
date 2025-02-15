package org.ssafy.respring.domain.book.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BookAutocompleteResponseDto {
    private Long id;
    private String title;
}
