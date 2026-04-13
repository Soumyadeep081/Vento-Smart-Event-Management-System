package com.vento.service;

import com.vento.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingScheduler {

    private final BookingRepository bookingRepository;

    /**
     * Runs every day at midnight (00:00).
     * Automatically completes CONFIRMED bookings whose event/booking date has passed.
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void autoCompletePastBookings() {
        log.info("Running scheduled task to auto-complete past bookings...");
        LocalDate today = LocalDate.now();
        int completedCount = bookingRepository.completePastBookings(today);
        log.info("Auto-completed {} past bookings.", completedCount);
    }
}
