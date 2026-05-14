/**
 * Role constants matching backend ENUM values.
 * Import these everywhere instead of hardcoding role strings.
 */
export const ROLES = {
  ADMIN: 'admin',
  RECEPTION: 'reception',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  LAB_TECHNICIAN: 'lab_technician',
  PHARMACIST: 'pharmacist',
  CASHIER: 'cashier',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.RECEPTION]: 'Reception',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.NURSE]: 'Nurse',
  [ROLES.LAB_TECHNICIAN]: 'Lab Technician',
  [ROLES.PHARMACIST]: 'Pharmacist',
  [ROLES.CASHIER]: 'Cashier',
};

export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.RECEPTION]: '/reception/dashboard',
  [ROLES.DOCTOR]: '/doctor/dashboard',
  [ROLES.NURSE]: '/nurse/dashboard',
  [ROLES.LAB_TECHNICIAN]: '/lab/dashboard',
  [ROLES.PHARMACIST]: '/pharmacist/dashboard',
  [ROLES.CASHIER]: '/cashier/dashboard',
};