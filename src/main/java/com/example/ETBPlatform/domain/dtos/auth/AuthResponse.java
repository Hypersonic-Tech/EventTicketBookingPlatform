package com.example.ETBPlatform.domain.dtos.auth;

import com.example.ETBPlatform.domain.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;

    private String tokenType;

    private UUID userId;

    private String email;

    private String firstName;

    private String lastName;

    private Role role;
}