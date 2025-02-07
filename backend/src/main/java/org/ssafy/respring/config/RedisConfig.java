package org.ssafy.respring.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // .env 파일에서 환경 변수 로드
        Dotenv dotenv = Dotenv.load();
        String redisHost = dotenv.get("REDIS_HOST", "i12a307.p.ssafy.io"); // 기본값 설정 가능
        int redisPort = Integer.parseInt(dotenv.get("REDIS_PORT", "6379"));
        String redisPassword = dotenv.get("REDIS_PASSWORD", ""); // 비밀번호가 설정되지 않았다면 빈 문자열

        RedisStandaloneConfiguration config = new RedisStandaloneConfiguration();
        config.setHostName(redisHost);
        config.setPort(redisPort);
        if (!redisPassword.isEmpty()) {
            config.setPassword(redisPassword);
        }

        return new LettuceConnectionFactory(config);
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer()); // JSON을 저장하려면 Jackson Serializer 사용 가능
        return template;
    }
}
