package com.vento.dto;

import com.vento.entity.Event;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class EventDto {

    @Data
    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotNull(message = "Event type is required")
        private Event.EventType type;

        private String customType;

        @NotNull(message = "Date is required")
        private LocalDate date;

        @NotBlank(message = "Location is required")
        private String location;

        @NotNull
        @Positive(message = "Budget must be positive")
        private BigDecimal budget;

        private String description;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private Event.EventType type;
        private String customType;
        private LocalDate date;
        private String location;
        private BigDecimal budget;
        private String description;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String type;
        private String customType;
        private LocalDate date;
        private String location;
        private BigDecimal budget;
        private BigDecimal remainingBudget;
        private String description;
        private Long userId;
        private String userName;
        private LocalDateTime createdAt;

        public static Response from(Event e) {
            Response r = new Response();
            r.setId(e.getId());
            r.setTitle(e.getTitle());
            r.setType(e.getType().name());
            r.setCustomType(e.getCustomType());
            r.setDate(e.getDate());
            r.setLocation(e.getLocation());
            r.setBudget(e.getBudget());
            r.setRemainingBudget(e.getRemainingBudget());
            r.setDescription(e.getDescription());
            r.setUserId(e.getUser().getId());
            r.setUserName(e.getUser().getName());
            r.setCreatedAt(e.getCreatedAt());
            return r;
        }
    }
}
