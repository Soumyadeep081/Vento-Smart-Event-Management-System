package com.vento.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.vento.dto.AuthDto;
import com.vento.entity.User;
import com.vento.exception.BadRequestException;
import com.vento.exception.ResourceNotFoundException;
import com.vento.repository.UserRepository;
import com.vento.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Authentication service handling registration, login, and social OAuth2 login.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${google.client-id}")
    private String googleClientId;

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : User.Role.USER)
                .phone(request.getPhone())
                .provider(User.AuthProvider.LOCAL)
                .build();

        user = userRepository.save(user);

        String token = generateToken(user);
        return new AuthDto.AuthResponse(token, user);
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (user.getProvider() != null && user.getProvider() != User.AuthProvider.LOCAL) {
            throw new BadRequestException("This account uses social login (Google/Facebook). Please sign in with your social account.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled");
        }

        String token = generateToken(user);
        return new AuthDto.AuthResponse(token, user);
    }

    /**
     * Social login — verifies the provider token, finds or creates a local user,
     * and returns a Vento JWT.
     */
    public AuthDto.AuthResponse socialLogin(AuthDto.SocialLoginRequest request) {
        String provider = request.getProvider().toUpperCase();

        return switch (provider) {
            case "GOOGLE" -> handleGoogleLogin(request);
            case "FACEBOOK" -> handleFacebookLogin(request);
            default -> throw new BadRequestException("Unsupported provider: " + provider);
        };
    }

    // ── Google ──────────────────────────────────────────────────────────────

    private AuthDto.AuthResponse handleGoogleLogin(AuthDto.SocialLoginRequest request) {
        String token = request.getToken();
        String email, name, sub;

        if (token.split("\\.").length == 3) {
            GoogleIdToken.Payload payload = verifyGoogleIdToken(token);
            email = payload.getEmail();
            name = (String) payload.get("name");
            sub = payload.getSubject();
        } else {
            String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + token;
            RestTemplate restTemplate = new RestTemplate();
            try {
                Map<?, ?> response = restTemplate.getForObject(url, Map.class);
                if (response == null || response.containsKey("error")) {
                    throw new BadRequestException("Invalid Google access token");
                }
                email = (String) response.get("email");
                name = (String) response.get("name");
                sub = (String) response.get("sub");
            } catch (Exception e) {
                log.error("Google access token verification failed", e);
                throw new BadRequestException("Google access token verification failed: " + e.getMessage());
            }
        }

        User user = findOrCreateSocialUser(email, name, sub, User.AuthProvider.GOOGLE, request.getRole());
        return new AuthDto.AuthResponse(generateToken(user), user);
    }

    private GoogleIdToken.Payload verifyGoogleIdToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new BadRequestException("Invalid Google ID token");
            }
            return idToken.getPayload();
        } catch (GeneralSecurityException | IOException e) {
            log.error("Google token verification failed", e);
            throw new BadRequestException("Google token verification failed: " + e.getMessage());
        }
    }

    // ── Facebook ─────────────────────────────────────────────────────────────

    private AuthDto.AuthResponse handleFacebookLogin(AuthDto.SocialLoginRequest request) {
        // Verify Facebook access token by calling the Graph API
        String accessToken = request.getToken();
        String url = "https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken;

        RestTemplate restTemplate = new RestTemplate();
        Map<?, ?> response;
        try {
            response = restTemplate.getForObject(url, Map.class);
        } catch (Exception e) {
            log.error("Facebook token verification failed", e);
            throw new BadRequestException("Facebook token verification failed: " + e.getMessage());
        }

        if (response == null || response.containsKey("error")) {
            throw new BadRequestException("Invalid Facebook access token");
        }

        String email = (String) response.get("email");
        String name = (String) response.get("name");
        String facebookId = (String) response.get("id");

        if (email == null) {
            throw new BadRequestException("Could not retrieve email from Facebook. Please ensure your Facebook account has a verified email.");
        }

        User user = findOrCreateSocialUser(email, name, facebookId, User.AuthProvider.FACEBOOK, request.getRole());
        return new AuthDto.AuthResponse(generateToken(user), user);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private User findOrCreateSocialUser(String email, String name, String providerId,
                                        User.AuthProvider provider, User.Role requestedRole) {
        Optional<User> existing = userRepository.findByEmail(email);

        if (existing.isPresent()) {
            User user = existing.get();
            if (!user.isEnabled()) {
                throw new BadRequestException("Account is disabled");
            }
            // Update provider info if not already set (e.g., user first registered with local email)
            if (user.getProvider() == null || user.getProvider() == User.AuthProvider.LOCAL) {
                user.setProvider(provider);
                user.setProviderId(providerId);
                user = userRepository.save(user);
            }
            return user;
        }

        // Create new user (Generate a random un-guessable password to satisfy DB NOT NULL constraint)
        User newUser = User.builder()
                .name(name != null ? name : email.split("@")[0])
                .email(email)
                .password(java.util.UUID.randomUUID().toString()) // No real password for social users
                .role(requestedRole != null ? requestedRole : User.Role.USER)
                .provider(provider)
                .providerId(providerId)
                .build();

        return userRepository.save(newUser);
    }

    private String generateToken(User user) {
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPassword() != null ? user.getPassword() : "",
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                );

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("userId", user.getId());
        claims.put("name", user.getName());

        return jwtUtil.generateToken(userDetails, claims);
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
