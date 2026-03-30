package com.vento.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Vendor entity representing a registered vendor profile.
 */
@Entity
@Table(name = "vendors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer experience = 0; // years

    @NotBlank
    private String city;

    private Double latitude;
    private Double longitude;

    @Column(nullable = false)
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Integer reviewCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private boolean verified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public enum ServiceCategory {
        CATERING,
        DECORATION,
        PHOTOGRAPHY,
        VIDEOGRAPHY,
        MUSIC_DJ,
        VENUE,
        TRANSPORTATION,
        SECURITY,
        LIGHTING,
        FLORAL,
        BAKERY,
        ENTERTAINMENT,
        OTHER
    }
}
