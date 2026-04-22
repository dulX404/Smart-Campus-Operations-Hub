export const validateNotification = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters long.";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  if (!data.targetRole) {
    errors.targetRole = "Please select a target audience.";
  }

  if (data.scheduledAt) {
    const scheduledDate = new Date(data.scheduledAt);
    const now = new Date();
    if (scheduledDate < now) {
      errors.scheduledAt = "Schedule date must be in the future.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
