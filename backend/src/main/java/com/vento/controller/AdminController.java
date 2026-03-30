package com.vento.controller;

import com.vento.entity.User;
import com.vento.entity.Vendor;
import com.vento.repository.BookingRepository;
import com.vento.repository.UserRepository;
import com.vento.repository.VendorRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin dashboard and management")
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get platform statistics")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(Map.of(
                "totalUsers", userRepository.count(),
                "totalVendors", vendorRepository.count(),
                "totalBookings", bookingRepository.count()
        ));
    }

    @GetMapping("/users")
    @Operation(summary = "List all users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(userRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending())));
    }

    @PatchMapping("/vendors/{id}/verify")
    @Operation(summary = "Verify a vendor")
    public ResponseEntity<Void> verifyVendor(@PathVariable Long id) {
        vendorRepository.findById(id).ifPresent(v -> {
            v.setVerified(true);
            vendorRepository.save(v);
        });
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Disable a user account")
    public ResponseEntity<Void> disableUser(@PathVariable Long id) {
        userRepository.findById(id).ifPresent(u -> {
            u.setEnabled(false);
            userRepository.save(u);
        });
        return ResponseEntity.noContent().build();
    }
}
