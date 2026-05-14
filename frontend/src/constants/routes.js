/**
 * All route path strings as constants.
 * Import everywhere instead of hardcoding path strings.
 */
export const ROUTES = {
  // Auth
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_FACILITIES: '/admin/facilities',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',

  // Reception
  RECEPTION_DASHBOARD: '/reception/dashboard',
  RECEPTION_CHECK_IN: '/reception/check-in',
  RECEPTION_NEW_PATIENT: '/reception/new-patient',
  RECEPTION_QUEUE: '/reception/queue',

  // Doctor
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_MY_QUEUE: '/doctor/my-queue',
  DOCTOR_CONSULTATION: '/doctor/consultation/:appointmentId',

  // Nurse
  NURSE_DASHBOARD: '/nurse/dashboard',
  NURSE_VITALS_QUEUE: '/nurse/vitals-queue',
  NURSE_RECORD_VITALS: '/nurse/record-vitals/:appointmentId',

  // Lab
  LAB_DASHBOARD: '/lab/dashboard',
  LAB_PENDING_REQUESTS: '/lab/pending-requests',
  LAB_RECORD_RESULTS: '/lab/record-results/:requestId',

  // Pharmacist
  PHARMACIST_DASHBOARD: '/pharmacist/dashboard',
  PHARMACIST_PRESCRIPTIONS: '/pharmacist/prescriptions',
  PHARMACIST_INVENTORY: '/pharmacist/inventory',

  // Cashier
  CASHIER_DASHBOARD: '/cashier/dashboard',
  CASHIER_UNPAID_BILLS: '/cashier/unpaid-bills',
  CASHIER_PROCESS_PAYMENT: '/cashier/process-payment/:billId',
};