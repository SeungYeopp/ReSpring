package org.ssafy.respring.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;
import org.ssafy.respring.domain.chat.repository.MongoChatMessageRepository;

@Configuration
@EnableJpaRepositories(
  basePackages = "org.ssafy.respring.domain",
  excludeFilters = {
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = MongoBookRepository.class),
	@ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, value = MongoChatMessageRepository.class),
  }
) // MongoDB Repository는 JPA에서 제외
@EntityScan(basePackages = "org.ssafy.respring.domain")
public class QueryDslConfig {

	@Bean
	public JPAQueryFactory jpaQueryFactory(EntityManager em) {
		return new JPAQueryFactory(em);
	}
}
