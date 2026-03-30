package com.vento.dto;

import com.vento.entity.Service;
import com.vento.entity.Vendor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ServiceDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Service name is required")
        private String name;

        private Vendor.ServiceCategory category;
        private String description;

        @NotNull
        @Positive(message = "Price must be positive")
        private BigDecimal price;

        private LocalDate availableFrom;
        private LocalDate availableTo;
        private boolean available = true;
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private Vendor.ServiceCategory category;
        private String description;
        private BigDecimal price;
        private LocalDate availableFrom;
        private LocalDate availableTo;
        private Boolean available;
        private Boolean active;
    }

    @Data
    public static class Response {
        private Long id;
        private Long vendorId;
        private String vendorName;
        private String vendorCity;
        private Double vendorRating;
        private String name;
        private String category;
        private String description;
        private BigDecimal price;
        private LocalDate availableFrom;
        private LocalDate availableTo;
        private boolean available;
        private boolean active;

        public static Response from(Service s) {
            Response r = new Response();
            r.setId(s.getId());
            r.setVendorId(s.getVendor().getId());
            r.setVendorName(s.getVendor().getBusinessName());
            r.setVendorCity(s.getVendor().getCity());
            r.setVendorRating(s.getVendor().getAverageRating());
            r.setName(s.getName());
            r.setCategory(s.getCategory() != null ? s.getCategory().name() : null);
            r.setDescription(s.getDescription());
            r.setPrice(s.getPrice());
            r.setAvailableFrom(s.getAvailableFrom());
            r.setAvailableTo(s.getAvailableTo());
            r.setAvailable(s.isAvailable());
            r.setActive(s.isActive());
            return r;
        }
    }
}
