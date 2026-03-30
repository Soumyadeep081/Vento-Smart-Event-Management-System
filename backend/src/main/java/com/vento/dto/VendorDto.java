package com.vento.dto;

import com.vento.entity.Vendor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class VendorDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Business name is required")
        private String businessName;

        @NotNull(message = "Category is required")
        private Vendor.ServiceCategory category;

        private String description;
        private Integer experience = 0;

        @NotBlank(message = "City is required")
        private String city;

        private Double latitude;
        private Double longitude;
    }

    @Data
    public static class UpdateRequest {
        private String businessName;
        private Vendor.ServiceCategory category;
        private String description;
        private Integer experience;
        private String city;
        private Double latitude;
        private Double longitude;
    }

    @Data
    public static class Response {
        private Long id;
        private Long userId;
        private String ownerName;
        private String ownerEmail;
        private String businessName;
        private String category;
        private String description;
        private Integer experience;
        private String city;
        private Double latitude;
        private Double longitude;
        private Double averageRating;
        private Integer reviewCount;
        private boolean verified;
        private LocalDateTime createdAt;

        // Recommendation/comparison score (computed dynamically)
        private Double score;

        public static Response from(Vendor v) {
            Response r = new Response();
            r.setId(v.getId());
            r.setUserId(v.getUser().getId());
            r.setOwnerName(v.getUser().getName());
            r.setOwnerEmail(v.getUser().getEmail());
            r.setBusinessName(v.getBusinessName());
            r.setCategory(v.getCategory().name());
            r.setDescription(v.getDescription());
            r.setExperience(v.getExperience());
            r.setCity(v.getCity());
            r.setLatitude(v.getLatitude());
            r.setLongitude(v.getLongitude());
            r.setAverageRating(v.getAverageRating());
            r.setReviewCount(v.getReviewCount());
            r.setVerified(v.isVerified());
            r.setCreatedAt(v.getCreatedAt());
            return r;
        }
    }
}
