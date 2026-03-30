package com.vento.controller;

import com.vento.dto.ReviewDto;
import com.vento.entity.User;
import com.vento.service.AuthService;
import com.vento.service.ReviewService;
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
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@Tag(name = "Reviews", description = "Vendor reviews and ratings")
public class ReviewController {

    private final ReviewService reviewService;
    private final AuthService authService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Submit a vendor review")
    public ResponseEntity<ReviewDto.Response> create(
            @Valid @RequestBody ReviewDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.create(request, user));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update own review")
    public ResponseEntity<ReviewDto.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody ReviewDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(reviewService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a review")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        reviewService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get all reviews for a vendor (public)")
    public ResponseEntity<List<ReviewDto.Response>> getByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(reviewService.getVendorReviews(vendorId));
    }
}
