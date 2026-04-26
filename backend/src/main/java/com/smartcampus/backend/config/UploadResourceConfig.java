package com.smartcampus.backend.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadResourceConfig implements WebMvcConfigurer {

    @Value("${app.uploads.ticket-dir:uploads/tickets}")
    private String ticketUploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(ticketUploadDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/tickets/**")
                .addResourceLocations(uploadPath.toUri().toString() + "/");
    }
}
