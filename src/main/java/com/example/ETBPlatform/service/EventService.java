package com.example.ETBPlatform.service;

import com.example.ETBPlatform.domain.dtos.EventRequestDto;
import com.example.ETBPlatform.domain.dtos.EventResponseDto;
import com.example.ETBPlatform.domain.entities.Event;
import com.example.ETBPlatform.domain.entities.Venue;
import com.example.ETBPlatform.repository.EventRepository;
import com.example.ETBPlatform.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final VenueRepository venueRepository;

    public EventResponseDto createEvent(EventRequestDto request){
        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("venue not found"));

        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription().trim())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .salesStart(request.getSalesStart())
                .salesEnd(request.getSalesEnd())
                .status(request.getStatus())
                .venue(venue)
                .build();
        Event savedEvent = eventRepository.save(event);

        return mapToResponse(savedEvent);
    }

    public EventResponseDto updateEvent(UUID id , EventRequestDto request){
        Event event = eventRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("event don't exist"));

        Venue venue = venueRepository.findById(request.getVenueId())
                        .orElseThrow(() -> new RuntimeException("venue don't exist"));

        event.setName(request.getName());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setSalesStart(request.getSalesStart());
        event.setSalesEnd(request.getSalesEnd());
        event.setVenue(venue);
        Event updatedEvent = eventRepository.save(event);

        return mapToResponse(updatedEvent);
    }

    public EventResponseDto getEventById(UUID eventId){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("no event here"));
        return mapToResponse(event);
    }

    public List<EventResponseDto> getAllEvents(){
        return eventRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteEvent(UUID eventId){
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("no event"));

        eventRepository.delete(event);
    }
    public EventResponseDto mapToResponse(Event event){
        return new EventResponseDto(
                event.getId(),
                event.getName(),
                event.getDescription(),
                event.getStartTime() ,
                event.getEndTime(),
                event.getSalesStart(),
                event.getSalesEnd(),
                event.getStatus(),
                event.getVenue().getId(),
                event.getCreatedAt(),
                event.getUpdatedAt()
        );
    }
}
