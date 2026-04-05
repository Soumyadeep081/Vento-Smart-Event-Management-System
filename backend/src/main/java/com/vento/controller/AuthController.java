package com.vento.controller;

import com.vento.dto.AuthDto;
import com.vento.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, and social OAuth2 endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<AuthDto.AuthResponse> register(@Valid @RequestBody AuthDto.RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT token")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/social-login")
    @Operation(summary = "Social login via Google or Facebook — verifies provider token and returns a Vento JWT")
    public ResponseEntity<AuthDto.AuthResponse> socialLogin(@Valid @RequestBody AuthDto.SocialLoginRequest request) {
        return ResponseEntity.ok(authService.socialLogin(request));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify OTP and receive JWT token")
    public ResponseEntity<AuthDto.AuthResponse> verifyOtp(@Valid @RequestBody AuthDto.VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/resend-otp")
    @Operation(summary = "Resend OTP for email verification")
    public ResponseEntity<Void> resendOtp(@Valid @RequestBody AuthDto.ResendOtpRequest request) {
        authService.resendOtp(request);
        return ResponseEntity.ok().build();
    }
}
