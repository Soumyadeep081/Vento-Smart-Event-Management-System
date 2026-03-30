package com.vento.service;

import com.vento.dto.BookingDto;
import com.vento.entity.*;
import com.vento.exception.BadRequestException;
import com.vento.exception.ResourceNotFoundException;
import com.vento.exception.UnauthorizedException;
import com.vento.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Booking service with double-booking prevention and budget enforcement.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventService eventService;
    private final ServiceManagementService serviceManagementService;
    private final NotificationService notificationService;

    @Transactional
    public BookingDto.Response create(BookingDto.CreateRequest request, User user) {
        Event event = eventService.getEventEntity(request.getEventId());

        // Authorization: only event owner can book
        if (!event.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only book for your own events");
        }

        com.vento.entity.Service service = serviceManagementService.getServiceEntity(request.getServiceId());

        if (!service.isAvailable() || !service.isActive()) {
            throw new BadRequestException("This service is not available for booking");
        }

        // Double booking check
        if (bookingRepository.existsActiveBooking(service.getId(), request.getBookingDate())) {
            throw new BadRequestException("Service is already booked for date: " + request.getBookingDate());
        }

        // Budget check
        eventService.deductBudget(event, service.getPrice());

        Booking booking = Booking.builder()
                .event(event)
                .service(service)
                .user(user)
                .bookingDate(request.getBookingDate())
                .cost(service.getPrice())
                .status(Booking.BookingStatus.CONFIRMED)
                .notes(request.getNotes())
                .build();

        booking = bookingRepository.save(booking);

        // Send notification
        notificationService.notify(user,
                "Booking confirmed for " + service.getName() + " at " + event.getTitle(),
                Notification.NotificationType.BOOKING_CONFIRMATION);

        return BookingDto.Response.from(booking);
    }

    @Transactional
    public BookingDto.Response updateStatus(Long bookingId, Booking.BookingStatus newStatus, User user) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", bookingId));

        // Only admin or booking owner can update status
        boolean isOwner = booking.getUser().getId().equals(user.getId());
        boolean isVendor = booking.getService().getVendor().getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole().equals(User.Role.ADMIN);

        if (!isOwner && !isVendor && !isAdmin) {
            throw new UnauthorizedException("Not authorized to update this booking");
        }

        // If cancelling, restore budget
        if (newStatus == Booking.BookingStatus.CANCELLED &&
                booking.getStatus() != Booking.BookingStatus.CANCELLED) {
            // Only allow cancellation within 24 hours for completed bookings
            eventService.restoreBudget(booking.getEvent(), booking.getCost());
        }

        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);

        notificationService.notify(booking.getUser(),
                "Booking status updated to " + newStatus.name() + " for " + booking.getService().getName(),
                Notification.NotificationType.BOOKING_STATUS_UPDATE);

        return BookingDto.Response.from(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingDto.Response> getUserBookings(User user) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(BookingDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDto.Response> getUserBookingsByStatus(User user, Booking.BookingStatus status) {
        return bookingRepository.findByUserIdAndStatusOrderByCreatedAtDesc(user.getId(), status).stream()
                .map(BookingDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingDto.Response> getEventBookings(Long eventId) {
        return bookingRepository.findByEventId(eventId).stream()
                .map(BookingDto.Response::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto.Response getById(Long id) {
        return BookingDto.Response.from(
                bookingRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Booking", id))
        );
    }
}
