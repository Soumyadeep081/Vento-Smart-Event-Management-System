package com.vento.repository;

import com.vento.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByEventId(Long eventId);

    List<Booking> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Booking.BookingStatus status);

    // Check for double booking: same service on the same event date
    @Query("SELECT COUNT(b) > 0 FROM Booking b WHERE " +
           "b.service.id = :serviceId AND " +
           "b.bookingDate = :date AND " +
           "b.status != 'CANCELLED'")
    boolean existsActiveBooking(@Param("serviceId") Long serviceId, @Param("date") LocalDate date);

    @Query("SELECT SUM(b.cost) FROM Booking b WHERE b.event.id = :eventId AND b.status != 'CANCELLED'")
    java.math.BigDecimal sumCostByEventId(@Param("eventId") Long eventId);

    @org.springframework.data.jpa.repository.Modifying
    @Query("UPDATE Booking b SET b.status = 'COMPLETED' WHERE b.bookingDate < :currentDate AND b.status = 'CONFIRMED'")
    int completePastBookings(@Param("currentDate") LocalDate currentDate);
}
