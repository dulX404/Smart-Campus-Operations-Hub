package com.smartcampus.backend.modules.auth.dto;

import lombok.Data;

@Data
public class UserDto {
    private String id;
    private String fullName;
    private String email;
    private String role;
}
