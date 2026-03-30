package com.vento.controller;

import com.vento.dto.VendorDto;
import com.vento.entity.User;
import com.vento.entity.Vendor;
import com.vento.service.AuthService;
import com.vento.service.VendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
@Tag(name = "Vendors", description = "Vendor profile management and search")
public class VendorController {

    private final VendorService vendorService;
    private final AuthService authService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create vendor profile (VENDOR role required)")
    public ResponseEntity<VendorDto.Response> create(
            @Valid @RequestBody VendorDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.create(request, user));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update vendor profile")
    public ResponseEntity<VendorDto.Response> update(
            @PathVariable Long id,
            @RequestBody VendorDto.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(vendorService.update(id, request, user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vendor by ID (public)")
    public ResponseEntity<VendorDto.Response> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current vendor's own profile")
    public ResponseEntity<VendorDto.Response> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(vendorService.getByCurrentUser(user));
    }

    @GetMapping
    @Operation(summary = "Get all vendors (paginated, public)")
    public ResponseEntity<Page<VendorDto.Response>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        return ResponseEntity.ok(vendorService.getAll(PageRequest.of(page, size, sort)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search and filter vendors (public)")
    public ResponseEntity<List<VendorDto.Response>> search(
            @RequestParam(required = false) Vendor.ServiceCategory category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(vendorService.search(category, city, minRating, minExperience, keyword));
    }
}
