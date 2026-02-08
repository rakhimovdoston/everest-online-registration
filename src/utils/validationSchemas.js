import { z } from 'zod';

// Login form validation schema (accepts email or phone number)
export const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or Phone Number is required')
    .refine(
      (value) => {
        // Check if it's an email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a phone number (international format)
        const phoneRegex = /^[\+]?[0-9]{9,15}$/;
        return emailRegex.test(value) || phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
      },
      'Please enter a valid email address or phone number'
    ),

  password: z
    .string()
    .min(1, 'Password is required'),
});

// Auth registration form validation schema (separate from test registration)
export const authRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name must be less than 30 characters')
    .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name must be less than 30 characters')
    .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[\+]?[0-9]{9,15}$/,
      'Please enter a valid phone number (e.g., +998901234567)'
    ),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Registration form validation schema
export const registrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase(),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      'Please enter a valid phone number (e.g., +1234567890 or 1234567890)'
    ),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),

  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),

  userType: z
    .enum(['student', 'teacher'], {
      required_error: 'Please select a user type',
      invalid_type_error: 'Please select either Student or Teacher',
    }),

  testDate: z
    .string()
    .min(1, 'Please select a test date')
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
      },
      'Test date must be in the future'
    ),

  testType: z
    .enum(['academic', 'general'], {
      required_error: 'Please select a test type',
      invalid_type_error: 'Please select either Academic or General Training',
    }),

  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Generate available test dates (next 60 days, Saturdays only)
export const generateTestDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 90; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Only Saturdays (day 6)
    if (date.getDay() === 6) {
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    }
  }

  return dates;
};

// User type options
export const USER_TYPES = [
  {
    value: 'student',
    label: 'Student',
    description: 'I am preparing for IELTS exam',
  },
  {
    value: 'teacher',
    label: 'Teacher',
    description: 'I am an IELTS instructor or educator',
  },
];

// Test type options
export const TEST_TYPES = [
  {
    value: 'academic',
    label: 'Academic',
    description: 'For university admissions and professional registration',
  },
  {
    value: 'general',
    label: 'General Training',
    description: 'For work experience, training programs, and immigration',
  },
];
