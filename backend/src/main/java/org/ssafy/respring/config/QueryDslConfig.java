package org.ssafy.respring.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.ssafy.respring.domain.book.repository.MongoBookRepository;

@Configuration
@EnableJpaRepositories(
  basePackages = "org.ssafy.respring.domain",
  excludeFilters = @ComponentScan.Filter(
	type = FilterType.ASSIGNABLE_TYPE,
	value = MongoBookRepository.class // MongoDB Repository 직접 제외
  )
) // MongoDB Repository는 JPA에서 제외
public class QueryDslConfig {

	@Bean
	public JPAQueryFactory jpaQueryFactory(EntityManager em) {
		return new JPAQueryFactory(em);
	}
}
