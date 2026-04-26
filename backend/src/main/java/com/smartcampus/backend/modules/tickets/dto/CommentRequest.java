package com.smartcampus.backend.modules.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CommentRequest {
    @NotBlank(message = "Comment is required")
    private String content;
}
