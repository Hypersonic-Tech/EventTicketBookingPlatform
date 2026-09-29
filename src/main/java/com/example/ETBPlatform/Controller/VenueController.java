package com.example.ETBPlatform.Controller;

import com.example.ETBPlatform.domain.dtos.VenueRequestDto;
import com.example.ETBPlatform.domain.dtos.VenueResponseDto;
import com.example.ETBPlatform.domain.entities.Venue;
import com.example.ETBPlatform.repository.VenueRepository;
import com.example.ETBPlatform.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueController {
    private final VenueService venueService;
    private final VenueRepository venueRepository;

    @PostMapping
    public VenueResponseDto createVenue(@Valid @RequestBody VenueRequestDto request){
        if(venueRepository.existsByNameAddressAndCity(
                request.getName(),request.getAddress() , request.getCity())){
            throw new RuntimeException("Venue already exists");
        }
        return venueService.createVenue(request);
    }

    @GetMapping
    public List<VenueResponseDto> getAllVenues(){
        return venueService.getAllVenues();
    }

    @GetMapping("/{venueId}")
    public VenueResponseDto getVenueById(@PathVariable UUID venueId) {
        return venueService.getVenueById(venueId);
    }

    @PutMapping("/{venueId}")
    public VenueResponseDto updateVenue(@PathVariable UUID venueId,
                                        @Valid @RequestBody VenueRequestDto request) {
        return venueService.updateVenue(venueId , request);
    }

}
