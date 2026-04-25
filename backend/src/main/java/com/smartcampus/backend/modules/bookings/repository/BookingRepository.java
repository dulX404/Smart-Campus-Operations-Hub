package com.smartcampus.backend.modules.bookings.repository;

import com.smartcampus.backend.modules.bookings.entity.Booking;
import com.smartcampus.backend.modules.bookings.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserIdOrderByRequestedAtDesc(String userId);

    List<Booking> findByStatusOrderByRequestedAtDesc(BookingStatus status);

    List<Booking> findAllByOrderByRequestedAtDesc();

    List<Booking> findByResourceId(String resourceId);

    @Query("{'resourceId': ?0, 'status': 'APPROVED', 'startTime': {'$lt': ?2}, 'endTime': {'$gt': ?1}}")
    List<Booking> findOverlappingApprovedBookings(String resourceId, LocalDateTime startTime, LocalDateTime endTime);
}
