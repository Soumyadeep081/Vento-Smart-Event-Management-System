package com.vento.controller;

import com.vento.dto.BookingDto;
import com.vento.entity.Booking;
import com.vento.entity.User;
import com.vento.service.AuthService;
import com.vento.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Booking management and order history")
@SecurityRequirement(name = "bearerAuth")
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<BookingDto.Response> create(
            @Valid @RequestBody BookingDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(request, user));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update booking status (confirm/cancel/complete)")
    public ResponseEntity<BookingDto.Response> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingDto.UpdateStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.updateStatus(id, request.getStatus(), user));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current user's booking history")
    public ResponseEntity<List<BookingDto.Response>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) Booking.BookingStatus status) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        if (status != null) {
            return ResponseEntity.ok(bookingService.getUserBookingsByStatus(user, status));
        }
        return ResponseEntity.ok(bookingService.getUserBookings(user));
    }

    @GetMapping("/event/{eventId}")
    @Operation(summary = "Get all bookings for a specific event")
    public ResponseEntity<List<BookingDto.Response>> getByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(bookingService.getEventBookings(eventId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID")
    public ResponseEntity<BookingDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel a booking")
    public ResponseEntity<BookingDto.Response> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.updateStatus(id, Booking.BookingStatus.CANCELLED, user));
    }
}
