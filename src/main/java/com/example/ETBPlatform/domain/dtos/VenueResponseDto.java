package com.example.ETBPlatform.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VenueResponseDto {

    private UUID id;
    private String name;
    private String address;
    private String city;
    private String state;
    private String country;
    private Integer capacity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}