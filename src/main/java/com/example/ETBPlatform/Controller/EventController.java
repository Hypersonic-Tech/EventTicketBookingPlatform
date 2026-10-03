package com.example.ETBPlatform.Controller;

import com.example.ETBPlatform.domain.dtos.EventRequestDto;
import com.example.ETBPlatform.domain.dtos.EventResponseDto;
import com.example.ETBPlatform.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vi/events")
public class EventController {
    private final EventService eventService;

    @PostMapping
    public EventResponseDto createEvent(@Valid @RequestBody EventRequestDto request) {
        return eventService.createEvent(request);
    }

    @PutMapping("{id}")
    public EventResponseDto updateEvent(@PathVariable UUID id ,
                                        @Valid @RequestBody EventRequestDto request) {
        return eventService.updateEvent(id , request);
    }
        @GetMapping
    public List<EventResponseDto> getAllEvents() {
        return eventService.getAllEvents();
    }
    @GetMapping("{id}")
    public EventResponseDto getEventById(@PathVariable UUID eventId) {
        return eventService.getEventById(eventId);
    }

    @DeleteMapping("{id}")
    public void deleteEvent(@PathVariable UUID eventId) {
        eventService.deleteEvent(eventId);
    }
    }