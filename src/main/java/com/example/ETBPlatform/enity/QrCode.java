package com.example.ETBPlatform.enity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "qr_code")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class QrCode {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id" , nullable = false , updatable = false)
    private UUID id;

    @Column(name="status" , nullable = false)
    @Enumerated(EnumType.STRING)
    private QrCodeStatusEnum status;

    @ManyToOne(fetch  = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @CreatedDate
    @Column(name = "created_at" , updatable = false , nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at" , updatable = false , nullable = false)
    private LocalDateTime updatedAt;
}