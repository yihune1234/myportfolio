/**
 * Mock admin service — staff, facilities, reports, audit logs.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_STAFF = [
  { id: 1, first_name: 'Abebe', last_name: 'Girma', role: 'admin', email: 'admin@clinic.et', clinic_id: 1, specialty: null, status: 'active' },
  { id: 2, first_name: 'Sara', last_name: 'Mekonnen', role: 'reception', email: 'reception@clinic.et', clinic_id: 1, specialty: null, status: 'active' },
  { id: 3, first_name: 'Samuel', last_name: 'Tesfaye', role: 'doctor', email: 'doctor@clinic.et', clinic_id: 1, specialty: 'General Practice', status: 'active' },
  { id: 4, first_name: 'Meron', last_name: 'Alemayehu', role: 'nurse', email: 'nurse@clinic.et', clinic_id: 1, specialty: null, status: 'active' },
  { id: 8, first_name: 'Yonas', last_name: 'Ayele', role: 'doctor', email: 'yonas.ayele@clinic.et', clinic_id: 1, specialty: 'Internal Medicine', status: 'active' },
];

const MOCK_CAMPUSES = [
  { id: 1, name: 'Main Campus', location: 'Addis Ababa', clinics: ['Health Center A', 'Health Center B'] },
  { id: 2, name: 'South Campus', location: 'Addis Ababa', clinics: ['Health Center C'] },
];

const MOCK_CLINICS = [
  { id: 1, name: 'Health Center A', campus_id: 1, type: 'general', status: 'active' },
  { id: 2, name: 'Health Center B', campus_id: 1, type: 'general', status: 'active' },
  { id: 3, name: 'Health Center C', campus_id: 2, type: 'general', status: 'active' },
];

const MOCK_WORK_AREAS = [
  { id: 1, name: 'Reception', clinic_id: 1, type: 'service_point' },
  { id: 2, name: 'Consultation Room 1', clinic_id: 1, type: 'consultation_room' },
  { id: 3, name: 'Consultation Room 2', clinic_id: 1, type: 'consultation_room' },
  { id: 4, name: 'Consultation Room 3', clinic_id: 1, type: 'consultation_room' },
  { id: 5, name: 'Vitals Room', clinic_id: 1, type: 'examination_room' },
  { id: 6, name: 'Lab', clinic_id: 1, type: 'service_point' },
  { id: 7, name: 'Pharmacy', clinic_id: 1, type: 'service_point' },
  { id: 8, name: 'Cashier', clinic_id: 1, type: 'service_point' },
];

export async function getDashboardSummary() {
  await mockDelay(300);
  return {
    success: true,
    data: {
      patients_today: 24,
      open_appointments: 8,
      pending_labs: 5,
      pending_prescriptions: 3,
      unpaid_bills: 12,
      low_stock_count: 2,
      staff_online: 6,
    },
  };
}

export async function getStaff(params) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_STAFF } };
}

export async function createStaff(data) {
  await mockDelay(350);
  const newStaff = { id: MOCK_STAFF.length + 1, ...data, status: 'active' };
  return { success: true, data: newStaff, message: 'Staff created successfully' };
}

export async function updateStaff(id, data) {
  await mockDelay(300);
  return { success: true, data: { id, ...data }, message: 'Staff updated successfully' };
}

export async function deactivateStaff(id) {
  await mockDelay(250);
  return { success: true, data: { id, status: 'inactive' }, message: 'Staff deactivated' };
}

export async function getCampuses() {
  await mockDelay(250);
  return { success: true, data: { items: MOCK_CAMPUSES } };
}

export async function getClinics(campusId) {
  await mockDelay(250);
  const items = campusId ? MOCK_CLINICS.filter((c) => c.campus_id === Number(campusId)) : MOCK_CLINICS;
  return { success: true, data: { items } };
}

export async function getWorkAreas(clinicId) {
  await mockDelay(250);
  const items = clinicId ? MOCK_WORK_AREAS.filter((w) => w.clinic_id === Number(clinicId)) : MOCK_WORK_AREAS;
  return { success: true, data: { items } };
}

export async function createCampus(data) {
  await mockDelay(300);
  return { success: true, data: { id: Date.now(), ...data }, message: 'Campus created successfully' };
}

export async function createClinic(data) {
  await mockDelay(300);
  return { success: true, data: { id: Date.now(), ...data }, message: 'Clinic created successfully' };
}

export async function createWorkArea(data) {
  await mockDelay(300);
  return { success: true, data: { id: Date.now(), ...data }, message: 'Work area created successfully' };
}

export async function getPatientVisitsReport(startDate, endDate) {
  await mockDelay(350);
  return { success: true, data: { items: [{ date: '2026-05-10', visits: 24 }] } };
}

export async function getFinancialSummary(startDate, endDate) {
  await mockDelay(350);
  return { success: true, data: { total_revenue: 12500, total_bills: 45, total_payments: 38 } };
}

export async function getLabVolumeReport(startDate, endDate) {
  await mockDelay(350);
  return { success: true, data: { items: [{ test: 'Full Blood Count', count: 12 }, { test: 'Malaria Rapid Test', count: 8 }] } };
}

export async function getInventoryReport() {
  await mockDelay(350);
  return { success: true, data: { items: [] } };
}

export async function getStaffActivityReport(startDate, endDate) {
  await mockDelay(350);
  return { success: true, data: { items: [] } };
}

export async function getAuditLogs(params) {
  await mockDelay(300);
  return { success: true, data: { items: [] } };
}