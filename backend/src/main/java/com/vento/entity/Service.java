package com.vento.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Service entity representing a specific service offered by a vendor.
 */
@Entity
@Table(name = "services")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private Vendor.ServiceCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull
    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal price;

    // Availability start and end dates
    private LocalDate availableFrom;
    private LocalDate availableTo;

    @Column(nullable = false)
    @Builder.Default
    private boolean available = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
