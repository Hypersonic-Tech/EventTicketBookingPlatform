package com.example.ETBPlatform.service;

import com.example.ETBPlatform.domain.CreateEventRequest;
import com.example.ETBPlatform.domain.entities.Event;

import java.util.UUID;

public interface EventService {
    Event createEvent(UUID organizerId , CreateEventRequest event);
}
