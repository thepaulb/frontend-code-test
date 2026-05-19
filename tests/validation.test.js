const {
  validateName,
  validateEmail,
  validateDob,
  validatePhone,
  validateForm,
} = require('../js/validation.js');

describe('validateName', () => {
  test('returns error for empty string', () => {
    expect(validateName('')).toBe('Enter your full name');
  });

  test('returns error for whitespace only', () => {
    expect(validateName('   ')).toBe('Enter your full name');
  });

  test('returns error for single name', () => {
    expect(validateName('Jane')).toBe('Enter your first and last name');
  });

  test('returns null for valid full name', () => {
    expect(validateName('Jane Smith')).toBeNull();
  });

  test('accepts names with more than two parts', () => {
    expect(validateName('Mary Jane Watson')).toBeNull();
  });

  test('trims leading and trailing spaces', () => {
    expect(validateName('  Jane Smith  ')).toBeNull();
  });
});

describe('validateEmail', () => {
  test('returns error for empty string', () => {
    expect(validateEmail('')).toBe('Enter an email address');
  });

  test('returns error for missing @', () => {
    expect(validateEmail('jane.example.com')).toBe('Enter a valid email address');
  });

  test('returns error for missing domain', () => {
    expect(validateEmail('jane@')).toBe('Enter a valid email address');
  });

  test('returns error for single-char TLD', () => {
    expect(validateEmail('jane@example.c')).toBe('Enter a valid email address');
  });

  test('returns null for valid email', () => {
    expect(validateEmail('jane@example.com')).toBeNull();
  });

  test('accepts email with subdomains', () => {
    expect(validateEmail('jane@mail.example.co.uk')).toBeNull();
  });

  test('accepts email with plus addressing', () => {
    expect(validateEmail('jane+test@example.com')).toBeNull();
  });
});

describe('validateDob', () => {
  test('returns error for empty string', () => {
    expect(validateDob('')).toBe('Enter your date of birth');
  });

  test('returns error for wrong format', () => {
    expect(validateDob('1990-03-27')).toBe(
      'Enter a date of birth in the format DD/MM/YYYY',
    );
  });

  test('returns error for invalid date like 31/02/2000', () => {
    expect(validateDob('31/02/2000')).toBe('Enter a real date');
  });

  test('returns error for future date', () => {
    expect(validateDob('01/01/2090')).toBe('Date of birth must be in the past');
  });

  test('returns null for valid past date', () => {
    expect(validateDob('27/03/1990')).toBeNull();
  });

  test('accepts DD-MM-YYYY with dashes', () => {
    expect(validateDob('27-03-1990')).toBeNull();
  });

  test('accepts single-digit day and month', () => {
    expect(validateDob('5/3/1990')).toBeNull();
  });
});

describe('validatePhone', () => {
  test('returns error for empty string', () => {
    expect(validatePhone('')).toBe('Enter a phone number');
  });

  test('returns error for too few digits', () => {
    expect(validatePhone('0123')).toBe('Enter a valid UK phone number');
  });

  test('returns error for non-UK format', () => {
    expect(validatePhone('+1 555 123 4567')).toBe(
      'Enter a valid UK phone number',
    );
  });

  test('returns null for valid UK mobile', () => {
    expect(validatePhone('07700900123')).toBeNull();
  });

  test('accepts UK number with spaces', () => {
    expect(validatePhone('07700 900 123')).toBeNull();
  });

  test('accepts UK landline', () => {
    expect(validatePhone('020 7946 0958')).toBeNull();
  });

  test('accepts +44 format', () => {
    expect(validatePhone('+447700900123')).toBeNull();
  });
});

describe('validateForm', () => {
  const validData = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    dob: '27/03/1990',
    phone: '07700900123',
  };

  test('returns empty object for valid data', () => {
    expect(validateForm(validData)).toEqual({});
  });

  test('returns errors for all empty fields', () => {
    const errors = validateForm({ name: '', email: '', dob: '', phone: '' });
    expect(Object.keys(errors)).toHaveLength(4);
  });

  test('returns only the fields with errors', () => {
    const errors = validateForm({ ...validData, email: 'bad' });
    expect(errors).toEqual({ email: 'Enter a valid email address' });
  });
});
