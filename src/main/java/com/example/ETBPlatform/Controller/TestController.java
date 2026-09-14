package com.example.ETBPlatform.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public String protectedEndpoint() {
        return "JWT authentication is working!";
    }

    @GetMapping("/attendee")
    public String attendeeEndpoint() {
        return "Welcome Attendee!";
    }

    @GetMapping("/organizer")
    public String organizerEndpoint() {
        return "Welcome Organizer!";
    }

    @GetMapping("/staff")
    public String staffEndpoint() {
        return "Welcome Staff!";
    }
}