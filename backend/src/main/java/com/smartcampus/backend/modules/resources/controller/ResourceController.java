package com.smartcampus.backend.modules.resources.controller;

import com.smartcampus.backend.modules.resources.dto.CreateResourceRequest;
import com.smartcampus.backend.modules.resources.dto.ResourceResponse;
import com.smartcampus.backend.modules.resources.dto.UpdateResourceRequest;
import com.smartcampus.backend.modules.resources.entity.ResourceStatus;
import com.smartcampus.backend.modules.resources.entity.ResourceType;
import com.smartcampus.backend.modules.resources.service.ResourceService;
import com.smartcampus.backend.response.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResourceResponse>> createResource(
            @Valid @RequestBody CreateResourceRequest request) {
        ResourceResponse resource = resourceService.createResource(request);

        ApiResponse<ResourceResponse> response = ApiResponse.<ResourceResponse>builder()
                .success(true)
                .message("Resource created successfully")
                .data(resource)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResourceResponse>>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity) {
        List<ResourceResponse> resources;

        if (type != null || status != null || (location != null && !location.isBlank()) || minCapacity != null) {
            resources = resourceService.filterResources(type, status, location, minCapacity);
        } else {
            resources = resourceService.getAllResources();
        }

        ApiResponse<List<ResourceResponse>> response = ApiResponse.<List<ResourceResponse>>builder()
                .success(true)
                .message("Resources retrieved successfully")
                .data(resources)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> getResourceById(@PathVariable String id) {
        ResourceResponse resource = resourceService.getResourceById(id);

        ApiResponse<ResourceResponse> response = ApiResponse.<ResourceResponse>builder()
                .success(true)
                .message("Resource retrieved successfully")
                .data(resource)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ResourceResponse>> updateResource(
            @PathVariable String id,
            @Valid @RequestBody UpdateResourceRequest request) {
        ResourceResponse resource = resourceService.updateResource(id, request);

        ApiResponse<ResourceResponse> response = ApiResponse.<ResourceResponse>builder()
                .success(true)
                .message("Resource updated successfully")
                .data(resource)
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(NoSuchElementException exception) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(exception.getMessage())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(IllegalArgumentException exception) {
        ApiResponse<Object> response = ApiResponse.builder()
                .success(false)
                .message(exception.getMessage())
                .data(null)
                .build();

        return ResponseEntity.badRequest().body(response);
    }
}
