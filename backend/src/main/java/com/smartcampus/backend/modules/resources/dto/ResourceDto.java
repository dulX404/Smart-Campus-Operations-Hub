package com.smartcampus.backend.modules.resources.dto;

import lombok.Data;

@Data
public class ResourceDto {
    private String id;
    private String name;
    private String type;
    private String location;
    private Boolean available;
}
