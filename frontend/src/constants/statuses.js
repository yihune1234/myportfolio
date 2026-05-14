/**
 * Status constants matching backend ENUM values.
 * One object per entity type — all status strings are defined here.
 */

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CHECKED_IN: 'checked_in',
  WITH_NURSE: 'with_nurse',
  WITH_DOCTOR: 'with_doctor',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const QUEUE_STATUS = {
  WAITING: 'waiting',
  WITH_NURSE: 'with_nurse',
  WITH_DOCTOR: 'with_doctor',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PRESCRIPTION_STATUS = {
  PENDING: 'pending',
  DISPENSED: 'dispensed',
  PARTIAL: 'partial',
  CANCELLED: 'cancelled',
};

export const LAB_REQUEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const BILL_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
  CANCELLED: 'cancelled',
};

export const STAFF_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
};

export const INVENTORY_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  DISCONTINUED: 'discontinued',
};

export const PATIENT_TYPE = {
  STUDENT: 'student',
  STAFF: 'staff',
  DEPENDENT: 'dependent',
  EXTERNAL: 'external',
};

export const PATHWAY = {
  WALK_IN: 'walk_in',
  EMERGENCY: 'emergency',
  NURSE_FIRST: 'nurse_first',
  APPOINTMENT: 'appointment',
};

export const PAYMENT_METHOD = {
  CASH: 'Cash',
  CARD: 'Card',
  MOBILE: 'Mobile',
  BANK: 'Bank',
};