package com.vento.controller;

import com.vento.dto.ServiceDto;
import com.vento.entity.User;
import com.vento.entity.Vendor;
import com.vento.service.AuthService;
import com.vento.service.ServiceManagementService;
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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "Vendor service/package management")
public class ServiceController {

    private final ServiceManagementService serviceManagementService;
    private final AuthService authService;

    @PostMapping("/vendor/{vendorId}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Add a service to vendor profile")
    public ResponseEntity<ServiceDto.Response> create(
            @PathVariable Long vendorId,
            @Valid @RequestBody ServiceDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(serviceManagementService.create(vendorId, request, user));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a service")
    public ResponseEntity<ServiceDto.Response> update(
            @PathVariable Long id,
            @RequestBody ServiceDto.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(serviceManagementService.update(id, request, user));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a service")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        serviceManagementService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID (public)")
    public ResponseEntity<ServiceDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceManagementService.getById(id));
    }

    @GetMapping("/vendor/{vendorId}")
    @Operation(summary = "Get all active services by vendor (public)")
    public ResponseEntity<List<ServiceDto.Response>> getByVendor(@PathVariable Long vendorId) {
        return ResponseEntity.ok(serviceManagementService.getByVendor(vendorId));
    }

    @GetMapping("/filter")
    @Operation(summary = "Filter services by category and price range")
    public ResponseEntity<List<ServiceDto.Response>> filter(
            @RequestParam(required = false) Vendor.ServiceCategory category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        return ResponseEntity.ok(serviceManagementService.filter(category, minPrice, maxPrice));
    }
}
