package com.smartcampus.backend.modules.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentDto {
    private String id;
    private String fullName;
    private String email;
    private String studentId;
    private String major;
    private final String role = "STUDENT";
}
