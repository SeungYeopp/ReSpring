package org.ssafy.respring.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
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

        // 디버깅용 로그 추가
        System.out.println("MONGODB_URI: " + uri);
        System.out.println("MONGODB_DATABASE: " + databaseName);

        // MongoDB 연결
        MongoClient mongoClient = MongoClients.create(uri);
        return mongoClient.getDatabase(databaseName);
    }
}
