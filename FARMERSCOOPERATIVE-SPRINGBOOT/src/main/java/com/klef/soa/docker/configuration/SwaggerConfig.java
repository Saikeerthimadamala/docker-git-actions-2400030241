package com.klef.soa.docker.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig
{
    @Bean
    public OpenAPI customOpenAPI()
    {
        return new OpenAPI()
                .info(new Info()
                        .title("Farmer Cooperative Service API")
                        .version("1.0")
                        .description("REST API Documentation for Farmer Cooperative")
                        .contact(new Contact()
                                .name("SaiKeerthi")
                                .email("keerthi@gmail.com")));
    }
}
