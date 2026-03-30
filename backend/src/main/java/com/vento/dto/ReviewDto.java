package com.vento.dto;

import com.vento.entity.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class ReviewDto {

    @Data
    public static class CreateRequest {
        @NotNull(message = "Vendor ID is required")
        private Long vendorId;

        @NotNull
        @Min(1) @Max(5)
        private Integer rating;

        private String comment;
    }

    @Data
    public static class Response {
        private Long id;
        private Long userId;
        private String userName;
        private Long vendorId;
        private String vendorName;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public static Response from(Review r) {
            Response resp = new Response();
            resp.setId(r.getId());
            resp.setUserId(r.getUser().getId());
            resp.setUserName(r.getUser().getName());
            resp.setVendorId(r.getVendor().getId());
            resp.setVendorName(r.getVendor().getBusinessName());
            resp.setRating(r.getRating());
            resp.setComment(r.getComment());
            resp.setCreatedAt(r.getCreatedAt());
            return resp;
        }
    }
}
