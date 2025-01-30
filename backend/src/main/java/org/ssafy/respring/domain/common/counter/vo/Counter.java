package org.ssafy.respring.domain.common.counter.vo;

import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter @Setter
@Document(collection = "counters")
public class Counter {
	@Id
	private String id;
	private Long seq;
}