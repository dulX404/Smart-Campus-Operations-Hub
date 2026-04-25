package com.smartcampus.backend.modules.resources.service;

import com.smartcampus.backend.modules.resources.dto.CreateResourceRequest;
import com.smartcampus.backend.modules.resources.dto.ResourceResponse;
import com.smartcampus.backend.modules.resources.dto.UpdateResourceRequest;
import com.smartcampus.backend.modules.resources.entity.Resource;
import com.smartcampus.backend.modules.resources.entity.ResourceStatus;
import com.smartcampus.backend.modules.resources.entity.ResourceType;
import com.smartcampus.backend.modules.resources.repository.ResourceRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceResponse createResource(CreateResourceRequest request) {
        LocalDateTime now = LocalDateTime.now();
        validateMetadata(request.getType(), request.getCapacity(), request.getLocation());
        boolean equipment = request.getType() == ResourceType.EQUIPMENT;

        Resource resource = Resource.builder()
                .name(request.getName())
                .type(request.getType())
                .capacity(equipment ? null : request.getCapacity())
                .location(equipment ? null : request.getLocation())
                .description(request.getDescription())
                .imageUrl(equipment ? request.getImageUrl() : null)
                .status(ResourceStatus.ACTIVE)
                .availabilityStart(request.getAvailabilityStart())
                .availabilityEnd(request.getAvailabilityEnd())
                .createdAt(now)
                .updatedAt(now)
                .build();

        return toResponse(resourceRepository.save(resource));
    }

    public List<ResourceResponse> getAllResources() {
        return resourceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ResourceResponse getResourceById(String id) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + id));

        return toResponse(resource);
    }

    public ResourceResponse updateResource(String id, UpdateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + id));

        if (request.getName() != null) {
            resource.setName(request.getName());
        }
        if (request.getType() != null) {
            resource.setType(request.getType());
        }
        if (request.getCapacity() != null) {
            resource.setCapacity(request.getCapacity());
        }
        if (request.getLocation() != null) {
            resource.setLocation(request.getLocation());
        }
        if (request.getDescription() != null) {
            resource.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            resource.setImageUrl(request.getImageUrl());
        }
        if (request.getStatus() != null) {
            resource.setStatus(request.getStatus());
        }
        if (request.getAvailabilityStart() != null) {
            resource.setAvailabilityStart(request.getAvailabilityStart());
        }
        if (request.getAvailabilityEnd() != null) {
            resource.setAvailabilityEnd(request.getAvailabilityEnd());
        }

        if (resource.getStatus() == null) {
            resource.setStatus(ResourceStatus.ACTIVE);
        }
        if (resource.getType() == ResourceType.EQUIPMENT) {
            resource.setCapacity(null);
            resource.setLocation(null);
        } else {
            validateMetadata(resource.getType(), resource.getCapacity(), resource.getLocation());
            resource.setImageUrl(null);
        }

        resource.setUpdatedAt(LocalDateTime.now());

        return toResponse(resourceRepository.save(resource));
    }

    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new NoSuchElementException("Resource not found with id: " + id);
        }

        resourceRepository.deleteById(id);
    }

    public List<ResourceResponse> filterResources(
            ResourceType type,
            ResourceStatus status,
            String location,
            Integer minCapacity
    ) {
        List<Resource> resources;

        if (type != null) {
            resources = resourceRepository.findByType(type);
        } else if (status != null) {
            resources = resourceRepository.findByStatus(status);
        } else if (location != null && !location.isBlank()) {
            resources = resourceRepository.findByLocationIgnoreCase(location);
        } else if (minCapacity != null) {
            resources = resourceRepository.findByCapacityGreaterThanEqual(minCapacity);
        } else {
            resources = resourceRepository.findAll();
        }

        return resources.stream()
                .filter(resource -> type == null || resource.getType() == type)
                .filter(resource -> status == null || resource.getStatus() == status)
                .filter(resource -> location == null || location.isBlank()
                        || (resource.getLocation() != null && resource.getLocation().equalsIgnoreCase(location)))
                .filter(resource -> minCapacity == null
                        || (resource.getCapacity() != null && resource.getCapacity() >= minCapacity))
                .map(this::toResponse)
                .toList();
    }

    private void validateMetadata(ResourceType type, Integer capacity, String location) {
        if (type == ResourceType.EQUIPMENT) {
            return;
        }
        if (capacity == null || capacity < 1) {
            throw new IllegalArgumentException("Capacity is required for this resource type");
        }
        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException("Location is required for this resource type");
        }
    }

    private ResourceResponse toResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .name(resource.getName())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .location(resource.getLocation())
                .description(resource.getDescription())
                .imageUrl(resource.getImageUrl())
                .status(resource.getStatus())
                .availabilityStart(resource.getAvailabilityStart())
                .availabilityEnd(resource.getAvailabilityEnd())
                .createdAt(resource.getCreatedAt())
                .updatedAt(resource.getUpdatedAt())
                .build();
    }
}
