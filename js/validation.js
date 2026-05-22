/**
 * validation.js
 *
 * Pure validation functions — no DOM access, no side effects.
 * Each function takes a string value and returns an error message or null.
 * This makes them trivial to unit test and reuse.
 */

/**
 * Validates a full name.
 * Must be non-empty and contain at least two words (first + last).
 */
export function validateName(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Enter your full name';
  }
  if (trimmed.split(/\s+/).length < 2) {
    return 'Enter your first and last name';
  }
  return null;
}

/**
 * Validates an email address.
 * Uses a practical regex — not RFC 5322 complete, but catches real-world mistakes.
 * We intentionally keep this simple rather than trying to handle every edge case.
 */
export function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Enter an email address';
  }
  // Checks: something @ something . something (at least 2 chars TLD)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return 'Enter a valid email address';
  }
  return null;
}

/**
 * Validates a date of birth in DD/MM/YYYY format.
 * Checks format, whether the date is real, and that it's in the past.
 */
export function validateDob(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Enter your date of birth';
  }

  // Accept DD/MM/YYYY or DD-MM-YYYY
  const dobPattern = /^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/;
  const match = trimmed.match(dobPattern);
  if (!match) {
    return 'Enter a date of birth in the format DD/MM/YYYY';
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Use Date constructor to check if the date is real.
  // Month is 0-indexed in JS, so we subtract 1.
  const date = new Date(year, month - 1, day);
  const isValidDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;

  if (!isValidDate) {
    return 'Enter a real date';
  }

  // Must be in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date >= today) {
    return 'Date of birth must be in the past';
  }

  return null;
}

/**
 * Validates a UK phone number.
 * Strips spaces and common formatting, then checks it looks like a UK number.
 */
export function validatePhone(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return 'Enter a phone number';
  }

  // Strip spaces, dashes, and parentheses for checking
  const digits = trimmed.replace(/[\s\-()]/g, '');

  // Accept UK formats: starts with 0 and 10-11 digits, or +44 and 10-12 digits
  const ukPattern = /^(?:0\d{9,10}|\+44\d{9,10})$/;
  if (!ukPattern.test(digits)) {
    return 'Enter a valid UK phone number';
  }

  return null;
}

/**
 * Runs all field validations and returns an object keyed by field name.
 * Only includes fields that have errors.
 *
 * Example return: { email: 'Enter a valid email address', dob: 'Enter a real date' }
 */
export function validateForm(data) {
  const errors = {};

  const nameError = validateName(data.name || '');
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email || '');
  if (emailError) errors.email = emailError;

  const dobError = validateDob(data.dob || '');
  if (dobError) errors.dob = dobError;

  const phoneError = validatePhone(data.phone || '');
  if (phoneError) errors.phone = phoneError;

  return errors;
}
