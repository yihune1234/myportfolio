/**
 * Mock auth service — returns hardcoded user objects per role.
 * Login shortcut: email prefix determines role returned.
 */
import { mockDelay } from '@/lib/mockDelay';

/**
 * Mock login users per role
 */
const MOCK_USERS = {
  admin: {
    id: 1,
    role: 'admin',
    first_name: 'Abebe',
    last_name: 'Girma',
    email: 'admin@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: null,
    token: 'mock.jwt.token.for.admin',
  },
  reception: {
    id: 2,
    role: 'reception',
    first_name: 'Sara',
    last_name: 'Mekonnen',
    email: 'reception@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: null,
    token: 'mock.jwt.token.for.reception',
  },
  doctor: {
    id: 3,
    role: 'doctor',
    first_name: 'Samuel',
    last_name: 'Tesfaye',
    email: 'doctor@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: 'General Practice',
    token: 'mock.jwt.token.for.doctor',
  },
  nurse: {
    id: 4,
    role: 'nurse',
    first_name: 'Meron',
    last_name: 'Alemayehu',
    email: 'nurse@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: null,
    token: 'mock.jwt.token.for.nurse',
  },
  lab_technician: {
    id: 5,
    role: 'lab_technician',
    first_name: 'Biruk',
    last_name: 'Tadesse',
    email: 'lab@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: null,
    token: 'mock.jwt.token.for.lab',
  },
  pharmacist: {
    id: 6,
    role: 'pharmacist',
    first_name: 'Hanna',
    last_name: 'Wondimu',
    email: 'pharmacist@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: null,
    token: 'mock.jwt.token.for.pharmacist',
  },
  cashier: {
    id: 7,
    role: 'cashier',
    first_name: 'Dawit',
    last_name: 'Haile',
    email: 'cashier@clinic.et',
    clinic_id: 1,
    campus_id: 1,
    specialty: null,
    token: 'mock.jwt.token.for.cashier',
  },
};

/**
 * Mock login — matches email prefix to role
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export async function login(email, password) {
  await mockDelay(500);

  // Determine role from email prefix
  let userData = null;
  for (const [role, user] of Object.entries(MOCK_USERS)) {
    if (email.toLowerCase().startsWith(role.toLowerCase())) {
      userData = { ...user, email };
      break;
    }
  }

  // Fallback: try exact email match
  if (!userData) {
    for (const user of Object.values(MOCK_USERS)) {
      if (user.email === email) {
        userData = { ...user };
        break;
      }
    }
  }

  if (!userData) {
    throw new Error('Invalid email or password');
  }

  // Simulate password check (all passwords "password123" work)
  if (password !== 'password123') {
    throw new Error('Invalid email or password');
  }

  return {
    success: true,
    data: {
      user: userData,
      token: userData.token,
    },
  };
}