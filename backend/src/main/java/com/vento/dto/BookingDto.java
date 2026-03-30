package com.vento.dto;

import com.vento.entity.Booking;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDto {

    @Data
    public static class CreateRequest {
        @NotNull(message = "Event ID is required")
        private Long eventId;

        @NotNull(message = "Service ID is required")
        private Long serviceId;

        @NotNull(message = "Booking date is required")
        private LocalDate bookingDate;

        private String notes;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotNull
        private Booking.BookingStatus status;
    }

    @Data
    public static class Response {
        private Long id;
        private Long eventId;
        private String eventTitle;
        private Long serviceId;
        private String serviceName;
        private Long vendorId;
        private String vendorName;
        private Long userId;
        private String userName;
        private LocalDate bookingDate;
        private BigDecimal cost;
        private String status;
        private String notes;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Booking b) {
            Response r = new Response();
            r.setId(b.getId());
            r.setEventId(b.getEvent().getId());
            r.setEventTitle(b.getEvent().getTitle());
            r.setServiceId(b.getService().getId());
            r.setServiceName(b.getService().getName());
            r.setVendorId(b.getService().getVendor().getId());
            r.setVendorName(b.getService().getVendor().getBusinessName());
            r.setUserId(b.getUser().getId());
            r.setUserName(b.getUser().getName());
            r.setBookingDate(b.getBookingDate());
            r.setCost(b.getCost());
            r.setStatus(b.getStatus().name());
            r.setNotes(b.getNotes());
            r.setCreatedAt(b.getCreatedAt());
            r.setUpdatedAt(b.getUpdatedAt());
            return r;
        }
    }
}
