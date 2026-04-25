package com.smartcampus.backend;

import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;

@SpringBootApplication
public class SmartCampusBackendApplication {

    private static final Logger log = LoggerFactory.getLogger(SmartCampusBackendApplication.class);
    private final MongoTemplate mongoTemplate;
    private final Environment environment;

    public SmartCampusBackendApplication(MongoTemplate mongoTemplate, Environment environment) {
        this.mongoTemplate = mongoTemplate;
        this.environment = environment;
    }

    public static void main(String[] args) {
        SpringApplication.run(SmartCampusBackendApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void logStartupStatus() {
        String activePort = environment.getProperty(
                "local.server.port",
                environment.getProperty("server.port", "unknown")
        );

        boolean isPort5000 = "5000".equals(activePort);
        boolean isMongoConnected = isMongoConnected();

        if (isMongoConnected && isPort5000) {
            log.info("[✔] Backend is up on port 5000 and MongoDB is connected.");
        } else {
            if (!isPort5000) {
                log.warn("[✔] Backend started, but running on port {} (expected 5000).", activePort);
            }
            if (!isMongoConnected) {
                log.error("Backend started, but MongoDB connection check failed.");
            }
        }
    }

    private boolean isMongoConnected() {
        try {
            Document result = mongoTemplate.executeCommand(new Document("ping", 1));
            Object ok = result.get("ok");
            return ok instanceof Number && ((Number) ok).doubleValue() == 1.0;
        } catch (Exception ex) {
            log.error("MongoDB ping failed: {}", ex.getMessage());
            return false;
        }
    }
}
