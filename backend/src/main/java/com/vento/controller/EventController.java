package com.vento.controller;

import com.vento.dto.EventDto;
import com.vento.entity.User;
import com.vento.service.AuthService;
import com.vento.service.EventService;
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
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Events", description = "Event management CRUD")
@SecurityRequirement(name = "bearerAuth")
public class EventController {

    private final EventService eventService;
    private final AuthService authService;

    @PostMapping
    @Operation(summary = "Create a new event")
    public ResponseEntity<EventDto.Response> create(
            @Valid @RequestBody EventDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an event")
    public ResponseEntity<EventDto.Response> update(
            @PathVariable Long id,
            @RequestBody EventDto.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(eventService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an event")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        eventService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<EventDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    @GetMapping("/my")
    @Operation(summary = "Get all events for current user")
    public ResponseEntity<List<EventDto.Response>> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(eventService.getUserEvents(user));
    }
}
