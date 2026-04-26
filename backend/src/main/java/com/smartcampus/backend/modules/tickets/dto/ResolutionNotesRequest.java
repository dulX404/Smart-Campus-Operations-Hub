package com.smartcampus.backend.modules.tickets.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResolutionNotesRequest {
    @NotBlank(message = "Resolution notes are required")
    private String resolutionNotes;
}
