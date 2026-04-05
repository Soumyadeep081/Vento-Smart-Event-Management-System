package com.vento.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Event entity representing an event created by a planner.
 */
@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType type;

    private String customType; // for custom event types

    @NotNull
    private LocalDate date;

    @NotBlank
    private String location;

    @NotNull
    @Column(precision = 12, scale = 2)
    private BigDecimal budget;

    @Column(precision = 12, scale = 2)
    private BigDecimal remainingBudget;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<Booking> bookings;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum EventType {
        WEDDING,
        BIRTHDAY_PARTY,
        CORPORATE_EVENT,
        CONFERENCE_SEMINAR,
        SOCIAL_GATHERING,
        FESTIVAL_CULTURAL,
        CUSTOM
    }
}
