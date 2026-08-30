package com.example.ETBPlatform.domain.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "events")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "name" , nullable = false)
    private String name;

    //event start and end
    @Column(name = "event_start" , nullable = false)
    private LocalDateTime start;

    @Column(name="event_end" , nullable = false)
    private LocalDateTime end;

    @Column(name= "venue" , nullable = false)
    private String venue;

    //sales start and sales end
    @Column(name = "sales_start" , nullable = false)
    private LocalDateTime salesStart;

    @Column(name = "sales_end" , nullable = false)
    private LocalDateTime salesEnd;

    @Column(name = "status" , nullable = false)
    @Enumerated(EnumType.STRING) //store an enum in the database as its name (String) instead of its numeric position (ordinal).
    private EventStatusEnum status;

    @OneToMany(mappedBy = "event" , cascade = CascadeType.ALL)
    private List<TicketType>ticketTypes = new ArrayList<>();

//owning side -> The side that controls the relationship in the database.
    @ManyToOne(fetch = FetchType.LAZY)//delays loading the related User until it's actually needed, which is generally better for performance.
    @JoinColumn(name = "organizer_id") //tells which column should store the foreign key
    private User organizer;

    @ManyToMany(mappedBy = "attendingEvents")
    private List<User> attendees = new ArrayList<>();

    @ManyToMany(mappedBy = "staffingEvents")
    private List<User> staff = new ArrayList<>();

    @CreatedDate
    @Column(name = "created_at" , updatable = false , nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at" , updatable = false , nullable = false)
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Event event = (Event) o;
        return Objects.equals(id, event.id) && Objects.equals(name, event.name) && Objects.equals(start, event.start) && Objects.equals(end, event.end) && Objects.equals(venue, event.venue) && Objects.equals(salesStart, event.salesStart) && Objects.equals(salesEnd, event.salesEnd) && status == event.status && Objects.equals(createdAt, event.createdAt) && Objects.equals(updatedAt, event.updatedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, start, end, venue, salesStart, salesEnd, status, createdAt, updatedAt);
    }
}
