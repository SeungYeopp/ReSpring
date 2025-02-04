package org.ssafy.respring.config;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.github.cdimascio.dotenv.Dotenv;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.elasticsearch.client.RestClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticSearchConfig {

    @Bean
    public ElasticsearchClient elasticsearchClient() {
        Dotenv dotenv = Dotenv.load();

        String elasticUri = dotenv.get("ELASTICSEARCH_URI", "http://localhost:9200");
        String elasticUser = dotenv.get("ELASTICSEARCH_USERNAME");
        String elasticPassword = dotenv.get("ELASTICSEARCH_PASSWORD");

        if (elasticUser == null || elasticPassword == null) {
            throw new IllegalArgumentException("Elasticsearch username or password is missing in .env file.");
        }

        BasicCredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(AuthScope.ANY,
                new UsernamePasswordCredentials(elasticUser, elasticPassword));

        RestClient restClient = RestClient.builder(HttpHost.create(elasticUri))
                .setHttpClientConfigCallback(httpClientBuilder -> httpClientBuilder
                        .setDefaultCredentialsProvider(credentialsProvider)
                ).build();

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        return new ElasticsearchClient(new RestClientTransport(
                restClient, new JacksonJsonpMapper(objectMapper)
        ));
    }
}
