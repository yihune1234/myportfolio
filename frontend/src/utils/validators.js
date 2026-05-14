/**
 * Client-side field validation helpers used in form components.
 */

/**
 * Validate an email address
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email is required' };
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return { valid: false, message: 'Invalid email format' };
  return { valid: true, message: '' };
}

/**
 * Validate a password
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters' };
  return { valid: true, message: '' };
}

/**
 * Validate a phone number (Ethiopian format)
 * @param {string} phone
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePhone(phone) {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  const re = /^\+251[0-9]{9}$/;
  if (!re.test(phone)) return { valid: false, message: 'Phone must be +251XXXXXXXXX format' };
  return { valid: true, message: '' };
}

/**
 * Validate that a value is not empty
 * @param {string} value
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true, message: '' };
}

/**
 * Validate a numeric range
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {string} fieldName
 * @returns {{ valid: boolean, message: string }}
 */
export function validateRange(value, min, max, fieldName) {
  if (value === null || value === undefined || isNaN(value)) {
    return { valid: false, message: `${fieldName} is required` };
  }
  if (value < min || value > max) {
    return { valid: false, message: `${fieldName} must be between ${min} and ${max}` };
  }
  return { valid: true, message: '' };
}

/**
 * Vitals-specific range validation
 */
export const VITAL_RANGES = {
  bp_systolic: { min: 70, max: 250, label: 'BP Systolic' },
  bp_diastolic: { min: 40, max: 150, label: 'BP Diastolic' },
  temperature: { min: 30, max: 45, label: 'Temperature' },
  pulse_rate: { min: 30, max: 200, label: 'Pulse Rate' },
  weight: { min: 1, max: 300, label: 'Weight' },
  height: { min: 30, max: 250, label: 'Height' },
};