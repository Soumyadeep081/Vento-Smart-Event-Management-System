package com.vento.controller;

import com.vento.dto.AuthDto;
import com.vento.dto.UserDto;
import com.vento.entity.User;
import com.vento.repository.UserRepository;
import com.vento.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile and account management")
public class UserController {

    private final UserRepository userRepository;
    private final AuthService authService;

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user profile data")
    public ResponseEntity<AuthDto.AuthResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(new AuthDto.AuthResponse(null, user));
    }

    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<AuthDto.AuthResponse> updateProfile(
            @RequestBody UserDto.UpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User user = authService.getCurrentUser(userDetails.getUsername());
        
        if (request.getName() != null) user.setName(request.getName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        
        user = userRepository.save(user);
        
        // Return updated session info (Frontend uses this to update AuthContext)
        return ResponseEntity.ok(new AuthDto.AuthResponse(null, user));
    }

    @PatchMapping("/verify-phone")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Simulate phone verification")
    public ResponseEntity<AuthDto.AuthResponse> verifyPhone(@AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        user.setPhoneVerified(true);
        user = userRepository.save(user);
        return ResponseEntity.ok(new AuthDto.AuthResponse(null, user));
    }
}
