package com.example.ETBPlatform.service;

import com.example.ETBPlatform.domain.dtos.VenueRequestDto;
import com.example.ETBPlatform.domain.dtos.VenueResponseDto;
import com.example.ETBPlatform.domain.entities.Venue;
import com.example.ETBPlatform.exceptions.EventTicketException;
import com.example.ETBPlatform.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    public VenueResponseDto createVenue(VenueRequestDto request) {

        Venue venue = Venue.builder()
                .name(request.getName().trim())
                .address(request.getAddress().trim())
                .city(request.getCity().trim())
                .state(request.getState().trim())
                .country(request.getCountry().trim())
                .capacity(request.getCapacity())
                .build();

        Venue savedVenue = venueRepository.save(venue);

        return mapToResponse(savedVenue);
    }

    public List<VenueResponseDto> getAllVenues() {

        return venueRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public VenueResponseDto getVenueById(UUID venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new EventTicketException(
                                "Venue not found: " + venueId
                        )
                );

        return mapToResponse(venue);
    }

    public VenueResponseDto updateVenue(UUID venueId,VenueRequestDto request) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new EventTicketException("Venue not found: " + venueId)
                );

        venue.setName(request.getName().trim());
        venue.setAddress(request.getAddress().trim());
        venue.setCity(request.getCity().trim());
        venue.setState(request.getState().trim());
        venue.setCountry(request.getCountry().trim());
        venue.setCapacity(request.getCapacity());

        Venue updatedVenue = venueRepository.save(venue);

        return mapToResponse(updatedVenue);
    }

    public void deleteVenue(UUID venueId) {

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() ->
                        new EventTicketException("Venue not found: " + venueId )
                );

        venueRepository.delete(venue);
    }

    private VenueResponseDto mapToResponse(Venue venue) {

        return new VenueResponseDto(
                venue.getId(),
                venue.getName(),
                venue.getAddress(),
                venue.getCity(),
                venue.getState(),
                venue.getCountry(),
                venue.getCapacity(),
                venue.getCreatedAt(),
                venue.getUpdatedAt()
        );
    }
}