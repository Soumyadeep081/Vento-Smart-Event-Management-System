package com.vento.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * User entity representing system users (planners, vendors, admins).
 * Supports both email/password and OAuth2 (Google, Facebook) authentication.
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    // Nullable for OAuth2 users who don't have a local password
    @Column(nullable = true)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String phone;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    // OAuth2 fields
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private AuthProvider provider;

    @Column(nullable = true)
    private String providerId;

    @Column(nullable = false)
    @Builder.Default
    private boolean phoneVerified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public String getAccountId() {
        if (id == null) return "N/A";
        return String.format("VNT-%06d", id);
    }

    public enum Role {
        USER, VENDOR, ADMIN
    }

    public enum AuthProvider {
        LOCAL, GOOGLE, FACEBOOK
    }
}
