package com.example.ETBPlatform.domain.dtos;

import com.example.ETBPlatform.domain.CreateTicketTypeRequest;
import com.example.ETBPlatform.domain.entities.EventStatusEnum;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequestDto {

    @NotNull(message = "Name is required")
    private String name;

    private LocalDateTime start;

    private LocalDateTime end;

    @NotNull(message = "Venue information is required")
    private String venue;

    private LocalDateTime salesStart;

    private LocalDateTime salesEnd;

    @NotNull(message = "Event status is required")
    private EventStatusEnum status;

    @NotEmpty(message = "At least one Ticket type is required")
    private List<CreateTicketTypeRequestDto> ticketTypes;

}
