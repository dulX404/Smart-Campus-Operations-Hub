package com.smartcampus.backend.modules.bookings.service;

import com.smartcampus.backend.modules.bookings.dto.BookingDto;
import com.smartcampus.backend.modules.bookings.entity.Booking;
import com.smartcampus.backend.modules.bookings.entity.BookingStatus;
import com.smartcampus.backend.modules.bookings.repository.BookingRepository;
import com.smartcampus.backend.modules.notifications.entity.Notification;
import com.smartcampus.backend.modules.notifications.service.NotificationService;
import com.smartcampus.backend.modules.resources.entity.Resource;
import com.smartcampus.backend.modules.resources.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService;

    public BookingDto createBooking(BookingDto request, String userId, String userEmail) {
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new NoSuchElementException("Resource not found with id: " + request.getResourceId()));

        // Validate for overlapping approved bookings
        List<Booking> conflictingBookings = bookingRepository.findOverlappingApprovedBookings(
                request.getResourceId(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!conflictingBookings.isEmpty()) {
            log.warn("Booking conflict detected for resource {}: {} conflicting approved bookings found for time slot {}-{}",
                request.getResourceId(), conflictingBookings.size(), request.getStartTime(), request.getEndTime());
            throw new IllegalArgumentException(
                "This time slot conflicts with " + conflictingBookings.size() +
                " existing approved booking(s). Please choose a different time."
            );
        }

        // Additional validation
        LocalDateTime now = LocalDateTime.now();
        if (request.getStartTime().isBefore(now)) {
            throw new IllegalArgumentException("Start time cannot be in the past.");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        // Check minimum duration (30 minutes)
        if (request.getEndTime().isBefore(request.getStartTime().plusMinutes(30))) {
            throw new IllegalArgumentException("Minimum booking duration is 30 minutes.");
        }

        // Check maximum duration (8 hours)
        if (request.getEndTime().isAfter(request.getStartTime().plusHours(8))) {
            throw new IllegalArgumentException("Maximum booking duration is 8 hours.");
        }

        Booking booking = Booking.builder()
                .userId(userId)
                .userEmail(userEmail)
                .resourceId(resource.getId())
                .resourceName(resource.getName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(BookingStatus.PENDING)
                .requestedAt(now)
                .build();

        return toDto(bookingRepository.save(booking));
    }

    public List<BookingDto> getMyBookings(String userId) {
        return bookingRepository.findByUserIdOrderByRequestedAtDesc(userId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAllByOrderByRequestedAtDesc()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<BookingDto> getBookingsForResource(String resourceId) {
        return bookingRepository.findByResourceId(resourceId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public List<BookingDto> getPendingBookings() {
        return bookingRepository.findByStatusOrderByRequestedAtDesc(BookingStatus.PENDING)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public BookingDto approveBooking(String id, String adminNotes) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedAt(LocalDateTime.now());
        booking.setAdminNotes(adminNotes);

        Booking saved = bookingRepository.save(booking);

        notificationService.createUserNotification(
                "Booking Approved",
                "Your booking for \"" + booking.getResourceName() + "\" has been approved.",
                booking.getUserId(),
                "ROLE_STUDENT"
        );

        return toDto(saved);
    }

    public BookingDto rejectBooking(String id, String adminNotes) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminNotes(adminNotes);

        Booking saved = bookingRepository.save(booking);

        notificationService.createUserNotification(
                "Booking Rejected",
                "Your booking for \"" + booking.getResourceName() + "\" has been rejected. Reason: " + (adminNotes != null ? adminNotes : "No reason provided"),
                booking.getUserId(),
                "ROLE_STUDENT"
        );

        return toDto(saved);
    }

    public BookingDto cancelBooking(String id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Booking not found with id: " + id));

        if (!booking.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("Only pending or approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        return toDto(bookingRepository.save(booking));
    }

    private BookingDto toDto(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setUserEmail(booking.getUserEmail());
        dto.setResourceId(booking.getResourceId());
        dto.setResourceName(booking.getResourceName());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setStatus(booking.getStatus());
        dto.setRequestedAt(booking.getRequestedAt());
        dto.setApprovedAt(booking.getApprovedAt());
        dto.setAdminNotes(booking.getAdminNotes());
        return dto;
    }
}
