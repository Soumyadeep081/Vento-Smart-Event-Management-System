package com.vento.config;

import com.vento.entity.*;
import com.vento.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Seed data loader - populates database with demo data on startup.
 * Only runs if the users table is empty.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            VendorRepository vendorRepository,
            ServiceRepository serviceRepository,
            EventRepository eventRepository) {

        return args -> {
            if (userRepository.count() > 0) {
                log.info("Database already seeded. Skipping...");
                return;
            }

            log.info("Seeding database with demo data...");

            // === Users ===
            User admin = userRepository.save(User.builder()
                    .name("Admin User")
                    .email("admin@vento.app")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .phone("+91-9000000000")
                    .build());

            User alice = userRepository.save(User.builder()
                    .name("Alice Johnson")
                    .email("alice@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.USER)
                    .phone("+91-9111111111")
                    .build());

            User bob = userRepository.save(User.builder()
                    .name("Bob Williams")
                    .email("bob@example.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.USER)
                    .phone("+91-9222222222")
                    .build());

            User vendor1User = userRepository.save(User.builder()
                    .name("Raj Catering")
                    .email("raj@catering.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .role(User.Role.VENDOR)
                    .phone("+91-9333333333")
                    .build());

            User vendor2User = userRepository.save(User.builder()
                    .name("Priya Decor")
                    .email("priya@decor.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .role(User.Role.VENDOR)
                    .phone("+91-9444444444")
                    .build());

            User vendor3User = userRepository.save(User.builder()
                    .name("Snapshot Studios")
                    .email("hi@snapshotstudios.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .role(User.Role.VENDOR)
                    .phone("+91-9555555555")
                    .build());

            User vendor4User = userRepository.save(User.builder()
                    .name("Melody Makers")
                    .email("band@melodymakers.com")
                    .password(passwordEncoder.encode("vendor123"))
                    .role(User.Role.VENDOR)
                    .phone("+91-9666666666")
                    .build());

            // === Vendors ===
            Vendor v1 = vendorRepository.save(Vendor.builder()
                    .user(vendor1User)
                    .businessName("Raj's Royal Catering")
                    .category(Vendor.ServiceCategory.CATERING)
                    .description("Premium catering for weddings, corporate events, and social gatherings. Experienced in multi-cuisine menus.")
                    .experience(12)
                    .city("Mumbai")
                    .latitude(19.0760)
                    .longitude(72.8777)
                    .averageRating(4.7)
                    .reviewCount(42)
                    .verified(true)
                    .build());

            Vendor v2 = vendorRepository.save(Vendor.builder()
                    .user(vendor2User)
                    .businessName("Priya's Dream Decor")
                    .category(Vendor.ServiceCategory.DECORATION)
                    .description("Transforming venues into magical spaces. Specializing in floral, theme, and luxury decorations.")
                    .experience(8)
                    .city("Delhi")
                    .latitude(28.6139)
                    .longitude(77.2090)
                    .averageRating(4.5)
                    .reviewCount(31)
                    .verified(true)
                    .build());

            Vendor v3 = vendorRepository.save(Vendor.builder()
                    .user(vendor3User)
                    .businessName("Snapshot Studios")
                    .category(Vendor.ServiceCategory.PHOTOGRAPHY)
                    .description("Award-winning photography and videography. We capture every moment beautifully.")
                    .experience(6)
                    .city("Bangalore")
                    .latitude(12.9716)
                    .longitude(77.5946)
                    .averageRating(4.9)
                    .reviewCount(58)
                    .verified(true)
                    .build());

            Vendor v4 = vendorRepository.save(Vendor.builder()
                    .user(vendor4User)
                    .businessName("Melody Makers DJ & Band")
                    .category(Vendor.ServiceCategory.MUSIC_DJ)
                    .description("Live bands, DJ services, sound systems for all event types. 100+ events performed.")
                    .experience(10)
                    .city("Mumbai")
                    .latitude(19.0820)
                    .longitude(72.8890)
                    .averageRating(4.3)
                    .reviewCount(27)
                    .verified(false)
                    .build());

            // === Services ===
            serviceRepository.save(Service.builder().vendor(v1).name("Full Wedding Catering").category(Vendor.ServiceCategory.CATERING)
                    .description("Complete catering for 200-500 guests. Multi-cuisine buffet.").price(new BigDecimal("85000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v1).name("Corporate Event Catering").category(Vendor.ServiceCategory.CATERING)
                    .description("Professional catering for conferences and seminars.").price(new BigDecimal("35000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v1).name("Birthday Celebration Catering").category(Vendor.ServiceCategory.CATERING)
                    .description("Fun and delicious catering for birthday parties up to 100 guests.").price(new BigDecimal("18000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v2).name("Wedding Hall Decoration").category(Vendor.ServiceCategory.DECORATION)
                    .description("Full venue decoration with flowers, drapes, lighting, and theme elements.").price(new BigDecimal("60000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v2).name("Stage & Backdrop Setup").category(Vendor.ServiceCategory.DECORATION)
                    .description("Custom stage design with LED backdrops and floral arrangements.").price(new BigDecimal("25000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v3).name("Wedding Photography Package").category(Vendor.ServiceCategory.PHOTOGRAPHY)
                    .description("Full day wedding photography with 500+ edited photos in premium album.").price(new BigDecimal("45000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v3).name("Event Videography").category(Vendor.ServiceCategory.VIDEOGRAPHY)
                    .description("Cinematic event video with drone shots and highlight reel.").price(new BigDecimal("55000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v4).name("DJ Night Package").category(Vendor.ServiceCategory.MUSIC_DJ)
                    .description("5-hour DJ performance with professional sound system and lighting.").price(new BigDecimal("20000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            serviceRepository.save(Service.builder().vendor(v4).name("Live Band Performance").category(Vendor.ServiceCategory.MUSIC_DJ)
                    .description("6-piece live band for weddings and corporate events.").price(new BigDecimal("40000")).available(true).active(true)
                    .availableFrom(LocalDate.now()).availableTo(LocalDate.now().plusYears(1)).build());

            // === Events ===
            eventRepository.save(Event.builder()
                    .title("Alice's Dream Wedding")
                    .type(Event.EventType.WEDDING)
                    .date(LocalDate.now().plusMonths(3))
                    .location("Grand Palace Hotel, Mumbai")
                    .budget(new BigDecimal("500000"))
                    .remainingBudget(new BigDecimal("500000"))
                    .description("Our wedding celebration with family and friends.")
                    .user(alice)
                    .build());

            eventRepository.save(Event.builder()
                    .title("Tech Corp Annual Conference")
                    .type(Event.EventType.CONFERENCE_SEMINAR)
                    .date(LocalDate.now().plusWeeks(6))
                    .location("Convention Center, Delhi")
                    .budget(new BigDecimal("200000"))
                    .remainingBudget(new BigDecimal("200000"))
                    .description("Annual company-wide conference and product showcase.")
                    .user(bob)
                    .build());

            log.info("Database seeding complete! Demo accounts created:");
            log.info("  Admin:  admin@vento.app / admin123");
            log.info("  User:   alice@example.com / password123");
            log.info("  Vendor: raj@catering.com / vendor123");
        };
    }
}
