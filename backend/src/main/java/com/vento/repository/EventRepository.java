package com.vento.repository;

import com.vento.entity.Event;
import com.vento.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByUserOrderByDateDesc(User user);
    List<Event> findByUserIdOrderByDateDesc(Long userId);
}
