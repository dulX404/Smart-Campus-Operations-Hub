package com.smartcampus.backend.modules.resources.dto;

import com.smartcampus.backend.modules.resources.entity.ResourceStatus;
import com.smartcampus.backend.modules.resources.entity.ResourceType;
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

    private Integer capacity;

    private String location;
    private String description;
    private String imageUrl;
    private ResourceStatus status;
    private LocalDateTime availabilityStart;
    private LocalDateTime availabilityEnd;
}
