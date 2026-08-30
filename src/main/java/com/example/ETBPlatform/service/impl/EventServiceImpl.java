package com.example.ETBPlatform.service.impl;

import com.example.ETBPlatform.domain.CreateEventRequest;
import com.example.ETBPlatform.domain.entities.Event;
import com.example.ETBPlatform.domain.entities.TicketType;
import com.example.ETBPlatform.domain.entities.User;
import com.example.ETBPlatform.exceptions.UserNotFoundException;
import com.example.ETBPlatform.repository.EventRepository;
import com.example.ETBPlatform.repository.UserRepository;
import com.example.ETBPlatform.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Override
    public Event createEvent(UUID organizerId, CreateEventRequest event) {
         User organizer = userRepository.findById(organizerId).
                orElseThrow(() -> new UserNotFoundException(
                        String.format("User with this id '%s' not found" , organizerId))
                );
         List<TicketType> TicketTypesToCreate =
                 event.getTicketTypes().stream().map(
        ticketType -> {
            TicketType ticketTypetoCreate = new TicketType();
            ticketTypetoCreate.setName(ticketType.getName());
            ticketTypetoCreate.setPrice(ticketType.getPrice());
            ticketTypetoCreate.setDescription(ticketType.getDescription());
            ticketTypetoCreate.setTotalAvailable(ticketType.getTotalAvailable());
            return ticketTypetoCreate;
        }).toList();

         Event eventToCreate = new Event();

         eventToCreate.setName(event.getName());
         eventToCreate.setStart(event.getStart());
         eventToCreate.setEnd(event.getEnd());
         eventToCreate.setVenue(event.getVenue());
         eventToCreate.setSalesStart(event.getSalesStart());
         eventToCreate.setSalesEnd(event.getSalesEnd());
         eventToCreate.setStatus(event.getStatus());
         eventToCreate.setOrganizer(organizer);
        eventToCreate.setTicketTypes(TicketTypesToCreate);


        return eventRepository.save(eventToCreate);
    }
}
