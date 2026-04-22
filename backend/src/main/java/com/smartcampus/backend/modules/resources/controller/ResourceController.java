package com.smartcampus.backend.modules.resources.controller;

import com.smartcampus.backend.response.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @GetMapping("/admin/manage")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<String> adminManage() {
        return ApiResponse.success("Admin Resource Management Access Granted", "Secret Admin Data");
    }

    @GetMapping("/public")
    public ApiResponse<String> publicView() {
        return ApiResponse.success("Resource Public View Access Granted", "Public Data");
    }
}
