export const validateBooking = (data, existingBookings = []) => {
  const errors = {};
  const now = new Date();

  // Start time validation
  if (!data.startTime) {
    errors.startTime = "Please select a start time.";
  } else {
    const startDate = new Date(data.startTime);

    if (startDate <= now) {
      errors.startTime = "Start time must be in the future.";
    }

    // Business hours validation (8 AM to 6 PM)
    const hour = startDate.getHours();
    if (hour < 8 || hour >= 18) {
      errors.startTime = "Bookings are only available between 8 AM and 6 PM.";
    }
  }

  // End time validation
  if (!data.endTime) {
    errors.endTime = "Please select an end time.";
  } else {
    const endDate = new Date(data.endTime);

    if (endDate <= now) {
      errors.endTime = "End time must be in the future.";
    }

    const hour = endDate.getHours();
    if (hour < 8 || hour >= 18) {
      errors.endTime = "Bookings are only available between 8 AM and 6 PM.";
    }
  }

  // Time range validation
  if (data.startTime && data.endTime) {
    const startDate = new Date(data.startTime);
    const endDate = new Date(data.endTime);

    if (startDate >= endDate) {
      errors.endTime = "End time must be after start time.";
    } else {
      const durationMinutes = Math.round((endDate - startDate) / (1000 * 60));

      if (durationMinutes < 30) {
        errors.endTime = "Minimum booking duration is 30 minutes.";
      }

      if (durationMinutes > 480) { // 8 hours
        errors.endTime = "Maximum booking duration is 8 hours.";
      }
    }
  }

  // Purpose validation
  if (!data.purpose || data.purpose.trim().length < 5) {
    errors.purpose = "Please provide a purpose (minimum 5 characters).";
  }

  if (data.purpose && data.purpose.trim().length > 500) {
    errors.purpose = "Purpose cannot exceed 500 characters.";
  }

  // Conflict validation with existing approved bookings
  if (data.startTime && data.endTime && existingBookings.length > 0) {
    const requestStart = new Date(data.startTime);
    const requestEnd = new Date(data.endTime);

    const conflictingBookings = existingBookings.filter(booking => {
      if (booking.status !== 'APPROVED') return false;

      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);

      // Check for overlap: (start1 < end2) AND (start2 < end1)
      return requestStart < bookingEnd && requestEnd > bookingStart;
    });

    if (conflictingBookings.length > 0) {
      errors.timeConflict = `This time slot is already booked. Please select a different time.`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    hasConflicts: Object.keys(errors).includes('timeConflict')
  };
};

export const validateBookingTimeRange = (startTime, endTime) => {
  const errors = {};

  if (!startTime) {
    errors.startTime = "Start time is required.";
  }

  if (!endTime) {
    errors.endTime = "End time is required.";
  }

  if (startTime && endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (startDate >= endDate) {
      errors.endTime = "End time must be after start time.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};