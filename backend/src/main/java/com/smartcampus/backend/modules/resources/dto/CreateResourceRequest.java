package com.smartcampus.backend.modules.resources.dto;

import com.smartcampus.backend.modules.resources.entity.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateResourceRequest {

    @NotBlank(message = "Resource name is required")
    private String name;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;
    private LocalDateTime availabilityStart;
    private LocalDateTime availabilityEnd;
}
