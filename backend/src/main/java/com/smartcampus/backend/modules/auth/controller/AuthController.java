package com.smartcampus.backend.modules.auth.controller;

import com.smartcampus.backend.modules.auth.dto.AdminDto;
import com.smartcampus.backend.modules.auth.dto.StudentDto;
import com.smartcampus.backend.modules.auth.entity.Admin;
import com.smartcampus.backend.modules.auth.entity.Student;
import com.smartcampus.backend.modules.auth.service.AuthService;
import com.smartcampus.backend.response.ApiResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody LoginRequest request) {
        String token = authService.authenticateAndGenerateToken(request.getEmail(), request.getPassword());
        if (token == null) {
            return ResponseEntity.status(401).body(ApiResponse.<LoginResponse>builder()
                    .success(false)
                    .message("Invalid credentials")
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.<LoginResponse>builder()
                .success(true)
                .message("Login successful")
                .data(new LoginResponse(token))
                .build());
    }

    @PostMapping("/register/admin")
    public ResponseEntity<ApiResponse<AdminDto>> registerAdmin(@RequestBody Admin admin) {
        return ResponseEntity.ok(ApiResponse.<AdminDto>builder()
                .success(true)
                .message("Admin registered successfully")
                .data(authService.registerAdmin(admin))
                .build());
    }

    @PostMapping("/register/student")
    public ResponseEntity<ApiResponse<StudentDto>> registerStudent(@RequestBody Student student) {
        return ResponseEntity.ok(ApiResponse.<StudentDto>builder()
                .success(true)
                .message("Student registered successfully")
                .data(authService.registerStudent(student))
                .build());
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Object>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", authService.getProfile(email)));
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LoginResponse {
        private String token;
    }
}
