package com.smartcampus.backend.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDto {
    private String id;
    private String fullName;
    private String email;
    private String department;
    private final String role = "ADMIN";
}
