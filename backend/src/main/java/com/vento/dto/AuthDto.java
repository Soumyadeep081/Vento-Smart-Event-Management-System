package com.vento.dto;

import com.vento.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "Name is required")
        private String name;

        @Email(message = "Valid email is required")
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private User.Role role = User.Role.USER;
        private String phone;
    }

    @Data
    public static class LoginRequest {
        @NotBlank
        private String email;

        @NotBlank
        private String password;
    }

    /**
     * Request body for social (Google / Facebook) login.
     * token: The ID token (Google) or access token (Facebook) from the client SDK.
     * provider: "GOOGLE" or "FACEBOOK"
     * role: Optional — used only when creating a new user via social sign-up.
     */
    @Data
    public static class SocialLoginRequest {
        @NotBlank
        private String token;

        @NotBlank
        private String provider; // "GOOGLE" or "FACEBOOK"

        private User.Role role = User.Role.USER;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String email;
        private String name;
        private String role;
        private Long userId;

        public AuthResponse(String token, User user) {
            this.token = token;
            this.email = user.getEmail();
            this.name = user.getName();
            this.role = user.getRole().name();
            this.userId = user.getId();
        }
    }
}
