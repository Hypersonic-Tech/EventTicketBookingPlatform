package com.example.ETBPlatform.repository;

import com.example.ETBPlatform.domain.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EventRepository extends JpaRepository<Event , UUID> {
}
