package com.smartcampus.backend.modules.resources.dto;

import com.smartcampus.backend.modules.resources.entity.ResourceStatus;
import com.smartcampus.backend.modules.resources.entity.ResourceType;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateResourceRequest {

    private String name;
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private Integer capacity;

    private String location;
    private String description;
    private ResourceStatus status;
    private LocalDateTime availabilityStart;
    private LocalDateTime availabilityEnd;
}
