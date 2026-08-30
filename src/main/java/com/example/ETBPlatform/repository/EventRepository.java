package com.example.ETBPlatform.repository;

import com.example.ETBPlatform.domain.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event , UUID> {

}
