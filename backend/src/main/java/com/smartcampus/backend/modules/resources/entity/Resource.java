package com.smartcampus.backend.modules.resources.entity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resources")
public class Resource {
    @Id
    private String id;

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    private Integer capacity;

    private String location;

    private String description;
    private String imageUrl;

    @Builder.Default
    @NotNull(message = "Resource status is required")
    private ResourceStatus status = ResourceStatus.ACTIVE;

    private LocalDateTime availabilityStart;
    private LocalDateTime availabilityEnd;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
