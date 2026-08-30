package com.example.ETBPlatform.mappers;

import com.example.ETBPlatform.domain.CreateEventRequest;
import com.example.ETBPlatform.domain.CreateTicketTypeRequest;
import com.example.ETBPlatform.domain.dtos.CreateEventRequestDto;
import com.example.ETBPlatform.domain.dtos.CreateEventResponseDto;
import com.example.ETBPlatform.domain.dtos.CreateTicketTypeRequestDto;
import com.example.ETBPlatform.domain.entities.Event;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

//this will make it a spring bean
//similar to doing mapperImpl with the component annotations

@Mapper(componentModel = "spring" , unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface EventMapper {
    CreateTicketTypeRequest fromDto(CreateTicketTypeRequestDto dto);

    CreateEventRequest fromDto(CreateEventRequestDto dto);

    CreateEventResponseDto toDto(Event event);
}
