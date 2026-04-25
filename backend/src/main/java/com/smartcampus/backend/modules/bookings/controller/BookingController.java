package com.smartcampus.backend.modules.bookings.controller;

import com.smartcampus.backend.modules.bookings.dto.BookingDto;
import com.smartcampus.backend.modules.bookings.service.BookingService;
import com.smartcampus.backend.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @Valid @RequestBody BookingDto request,
            Authentication authentication) {
        String userId = authentication.getName();
        String userEmail = authentication.getName();
        BookingDto booking = bookingService.createBooking(request, userId, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking request submitted successfully", booking));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(Authentication authentication) {
        String userId = authentication.getName();
        List<BookingDto> bookings = bookingService.getMyBookings(userId);
        return ResponseEntity.ok(ApiResponse.success("My bookings retrieved", bookings));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getAllBookings() {
        List<BookingDto> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("All bookings retrieved", bookings));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getPendingBookings() {
        List<BookingDto> bookings = bookingService.getPendingBookings();
        return ResponseEntity.ok(ApiResponse.success("Pending bookings retrieved", bookings));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> approveBooking(
            @PathVariable String id,
            @RequestBody(required = false) String adminNotes) {
        BookingDto booking = bookingService.approveBooking(id, adminNotes);
        return ResponseEntity.ok(ApiResponse.success("Booking approved successfully", booking));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<BookingDto>> rejectBooking(
            @PathVariable String id,
            @RequestBody(required = false) String adminNotes) {
        BookingDto booking = bookingService.rejectBooking(id, adminNotes);
        return ResponseEntity.ok(ApiResponse.success("Booking rejected successfully", booking));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @PathVariable String id,
            Authentication authentication) {
        String userId = authentication.getName();
        BookingDto booking = bookingService.cancelBooking(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(NoSuchElementException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(exception.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(exception.getMessage()));
    }
}
