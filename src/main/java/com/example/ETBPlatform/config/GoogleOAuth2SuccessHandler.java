package com.example.ETBPlatform.config;

import com.example.ETBPlatform.domain.entities.User;
import com.example.ETBPlatform.service.GoogleUserProvisioningService;
import com.example.ETBPlatform.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class GoogleOAuth2SuccessHandler
        extends SimpleUrlAuthenticationSuccessHandler {

    private final GoogleUserProvisioningService googleUserProvisioningService;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauth2User =
                (OAuth2User) authentication.getPrincipal();

        User user =
                googleUserProvisioningService.processGoogleUser(oauth2User);

        String token = jwtService.generateToken(user);

        String redirectUrl =
                "http://localhost:63342/ETBPlatform/pages/events.html#token=" + token;

        System.out.println("redicrect url" + redirectUrl);

        getRedirectStrategy().sendRedirect(
                request,
                response,
                redirectUrl
        );
    }
}