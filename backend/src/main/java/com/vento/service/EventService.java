package com.vento.service;

import com.vento.dto.EventDto;
import com.vento.entity.Event;
import com.vento.entity.User;
import com.vento.exception.BadRequestException;
import com.vento.exception.ResourceNotFoundException;
import com.vento.exception.UnauthorizedException;
import com.vento.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Event management service - CRUD + budget tracking.
 */
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    @Transactional
    public EventDto.Response create(EventDto.CreateRequest request, User user) {
        Event event = Event.builder()
                .title(request.getTitle())
                .type(request.getType())
                .customType(request.getCustomType())
                .date(request.getDate())
                .location(request.getLocation())
                .budget(request.getBudget())
                .remainingBudget(request.getBudget())
                .description(request.getDescription())
                .user(user)
                .build();

        return EventDto.Response.from(eventRepository.save(event));
    }

    @Transactional
    public EventDto.Response update(Long id, EventDto.UpdateRequest request, User user) {
        Event event = findByIdAndUser(id, user);

        if (request.getTitle() != null) event.setTitle(request.getTitle());
        if (request.getType() != null) event.setType(request.getType());
        if (request.getCustomType() != null) event.setCustomType(request.getCustomType());
        if (request.getDate() != null) event.setDate(request.getDate());
        if (request.getLocation() != null) event.setLocation(request.getLocation());
        if (request.getBudget() != null) {
            // Adjust remaining budget proportionally
            java.math.BigDecimal diff = request.getBudget().subtract(event.getBudget());
            event.setBudget(request.getBudget());
            event.setRemainingBudget(event.getRemainingBudget().add(diff));
        }
        if (request.getDescription() != null) event.setDescription(request.getDescription());

        return EventDto.Response.from(eventRepository.save(event));
    }

    @Transactional
    public void delete(Long id, User user) {
        Event event = findByIdAndUser(id, user);
        eventRepository.delete(event);
    }

    @Transactional(readOnly = true)
    public EventDto.Response getById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));
        return EventDto.Response.from(event);
    }

    @Transactional(readOnly = true)
    public List<EventDto.Response> getUserEvents(User user) {
        return eventRepository.findByUserOrderByDateDesc(user).stream()
                .map(EventDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * Deduct cost from remaining budget after booking.
     */
    @Transactional
    public void deductBudget(Event event, java.math.BigDecimal amount) {
        if (event.getRemainingBudget().compareTo(amount) < 0) {
            throw new BadRequestException("Insufficient budget. Remaining: " + event.getRemainingBudget()
                    + ", Required: " + amount);
        }
        event.setRemainingBudget(event.getRemainingBudget().subtract(amount));
        eventRepository.save(event);
    }

    /**
     * Restore budget when a booking is cancelled.
     */
    @Transactional
    public void restoreBudget(Event event, java.math.BigDecimal amount) {
        event.setRemainingBudget(event.getRemainingBudget().add(amount));
        eventRepository.save(event);
    }

    public Event getEventEntity(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));
    }

    private Event findByIdAndUser(Long id, User user) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", id));
        if (!event.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You don't have permission to modify this event");
        }
        return event;
    }
}
