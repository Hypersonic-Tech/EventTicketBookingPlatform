package com.example.ETBPlatform.domain.dtos;

import com.example.ETBPlatform.domain.enums.EventStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequestDto {

    @NotNull(message = "Name is required")
    private String name;

    @NotNull(message = "description is required")
    private String description;

    @NotNull(message = "start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "end time is required")
    private LocalDateTime endTime;

    @NotNull(message = "sales start is required")
    private LocalDateTime salesStart;

    @NotNull(message = "sales end is required")
    private LocalDateTime salesEnd;

    private EventStatus status;

    @NotEmpty(message = "At least one Ticket type is required")
    private List<CreateTicketTypeRequestDto> ticketTypes;

    @NotNull(message = "venue is required")
    private UUID venueId;

}
