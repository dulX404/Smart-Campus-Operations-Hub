package com.smartcampus.backend.modules.bookings.repository;

import com.smartcampus.backend.modules.bookings.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookingRepository extends MongoRepository<Booking, String> {
}
