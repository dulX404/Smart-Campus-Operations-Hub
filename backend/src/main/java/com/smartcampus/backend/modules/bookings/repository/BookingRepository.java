package com.smartcampus.backend.modules.bookings.repository;

import com.smartcampus.backend.modules.bookings.entity.Booking;
import com.smartcampus.backend.modules.bookings.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserIdOrderByRequestedAtDesc(String userId);

    List<Booking> findByStatusOrderByRequestedAtDesc(BookingStatus status);

    List<Booking> findAllByOrderByRequestedAtDesc();

    List<Booking> findByResourceId(String resourceId);
}
