package com.example.ETBPlatform.repository;

import com.example.ETBPlatform.domain.entities.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VenueRepository extends JpaRepository<Venue, UUID> {
    public boolean existsByNameAddressAndCity(String name , String Address , String city);
}
