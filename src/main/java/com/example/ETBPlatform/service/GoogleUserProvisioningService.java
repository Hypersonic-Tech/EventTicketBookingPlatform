package com.example.ETBPlatform.service;

import com.example.ETBPlatform.domain.entities.User;
import com.example.ETBPlatform.domain.enums.AuthProvider;
import com.example.ETBPlatform.domain.enums.Role;
import com.example.ETBPlatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GoogleUserProvisioningService {

    private final UserRepository userRepository;

    public User processGoogleUser(OAuth2User oauth2User) {

        String email = oauth2User.getAttribute("email");
        String firstName = oauth2User.getAttribute("given_name");
        String lastName = oauth2User.getAttribute("family_name");

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {

            user = User.builder()
                    .email(email)
                    .firstName(firstName != null ? firstName : "")
                    .lastName(lastName != null ? lastName : "")
                    .role(Role.ATTENDEE)
                    .authProvider(AuthProvider.GOOGLE)
                    .enabled(true)
                    .password(null)
                    .build();

            return userRepository.save(user);
        }

        return user;
    }
}