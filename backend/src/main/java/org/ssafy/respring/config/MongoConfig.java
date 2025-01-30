package org.ssafy.respring.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "org.ssafy.respring.domain.book.repository") // MongoDB만 활성화
@ComponentScan(basePackages = "org.ssafy.respring.domain.book") // MongoDB 관련 Bean만 스캔
@EntityScan(basePackages = "org.ssafy.respring.domain.book.vo") // Book 엔티티만 인식
public class MongoConfig {

    private final Dotenv dotenv;

    public MongoConfig() {
        this.dotenv = Dotenv.configure().load();
    }

    @Bean
    public MongoDatabase mongoDatabase() {
        // 환경 변수 로드
        String uri = dotenv.get("MONGODB_URI", "mongodb://localhost:27017"); // 기본값
        String databaseName = dotenv.get("MONGODB_DATABASE", "respring");   // 기본값

        // MongoDB 연결
        MongoClient mongoClient = MongoClients.create(uri);
        return mongoClient.getDatabase(databaseName);
    }
}
