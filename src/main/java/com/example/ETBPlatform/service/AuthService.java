package com.example.ETBPlatform.service;

import com.example.ETBPlatform.domain.enums.Role;
import com.example.ETBPlatform.domain.dtos.auth.AuthResponse;
import com.example.ETBPlatform.domain.dtos.auth.LoginRequest;
import com.example.ETBPlatform.domain.dtos.auth.RegisterRequest;
import com.example.ETBPlatform.domain.entities.User;
import com.example.ETBPlatform.domain.enums.AuthProvider;
import com.example.ETBPlatform.exceptions.EventTicketException;
import com.example.ETBPlatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;


    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EventTicketException("Email already registered");
        }

        if (request.getRole() == Role.ADMIN ||
                request.getRole() == Role.STAFF) {

            throw new EventTicketException(
                    "This role cannot be created through public registration"
            );
        }

        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .role(request.getRole())
                .authProvider(AuthProvider.LOCAL)
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .role(savedUser.getRole())
                .authProvider(savedUser.getAuthProvider())
                .token(token)
                .build();
    }


    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(
                        request.getEmail().trim().toLowerCase()
                )
                .orElseThrow(() ->
                        new EventTicketException(
                                "Invalid email or password"
                        )
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new EventTicketException(
                    "Invalid email or password"
            );
        }

        if (!user.isEnabled()) {
            throw new EventTicketException(
                    "User account is disabled"
            );
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .authProvider(user.getAuthProvider())
                .token(token)
                .build();
    }
}