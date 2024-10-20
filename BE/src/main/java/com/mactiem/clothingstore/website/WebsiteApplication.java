package com.mactiem.clothingstore.website;

import com.mactiem.clothingstore.website.entity.Authority;
import com.mactiem.clothingstore.website.entity.Category;
import com.mactiem.clothingstore.website.repository.AuthorityRepository;
import com.mactiem.clothingstore.website.repository.CategoryRepository;
import com.mactiem.clothingstore.website.service.AuthorityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@SpringBootApplication
public class WebsiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebsiteApplication.class, args);
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");
            }

        };
    }

    @Configuration
    public class WebConfig implements WebMvcConfigurer {
        @Override
        public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
            configurer.defaultContentType(MediaType.APPLICATION_JSON);
        }
    }

    @Bean
    public CommandLineRunner setupDefaultAuthorities(AuthorityService authorityService, AuthorityRepository authorityRepository) {
        return args -> {
            List<String> requiredAuthorities = List.of("ROLE_USER", "ROLE_STAFF", "ROLE_ADMIN");
            List<Authority> existingAuthorities = authorityService.getAllAuthorities();
            List<String> existingAuthorityNames = existingAuthorities.stream()
                    .map(Authority::getAuthority)
                    .collect(Collectors.toList());

            requiredAuthorities.forEach(authority -> {
                if (!existingAuthorityNames.contains(authority)) {
                    Authority newAuthority = new Authority();
                    newAuthority.setAuthority(authority);
                    authorityRepository.save(newAuthority); // Ensure this method exists in your AuthorityService
                }
            });
        };
    }

}
