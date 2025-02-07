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

        String elasticUri = System.getenv("ELASTICSEARCH_URI");
        String elasticUser = System.getenv("ELASTICSEARCH_USERNAME");
        String elasticPassword = System.getenv("ELASTICSEARCH_PASSWORD");

        if (elasticUri == null || elasticUri.isEmpty()) {
            throw new IllegalArgumentException("Environment variable 'ELASTICSEARCH_URI' is missing or empty.");
        }
        if (elasticUser == null || elasticUser.isEmpty()) {
            throw new IllegalArgumentException("Environment variable 'ELASTICSEARCH_USERNAME' is missing or empty.");
        }
        if (elasticPassword == null || elasticPassword.isEmpty()) {
            throw new IllegalArgumentException("Environment variable 'ELASTICSEARCH_PASSWORD' is missing or empty.");
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
