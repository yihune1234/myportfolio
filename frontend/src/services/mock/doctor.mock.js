it /**
 * Mock doctor service — queue, consultation, medical record, prescription, lab request.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_CONSULTATION_DATA = {
  appointment_id: 8,
  patient_id: 12,
  first_name: 'Tigist',
  last_name: 'Bekele',
  date_of_birth: '1998-04-15',
  gender: 'female',
  patient_type: 'student',
  contact: '+251912345678',
  vitals: { bp_systolic: 118, bp_diastolic: 76, temperature: 36.9, pulse_rate: 72, weight: 58.5, height: 162 },
  medical_history: [
    { visit_date: '2026-01-15', diagnosis: 'Acute bronchitis', treatment: 'Prescribed antibiotics and rest', prescriptions: [{ drug_name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration_days: 7 }], lab_results: [] },
    { visit_date: '2025-09-20', diagnosis: 'Urinary tract infection', treatment: 'Prescribed antibiotics', prescriptions: [{ drug_name: 'Ciprofloxacin', dosage: '500mg', frequency: 'Twice daily', duration_days: 5 }], lab_results: [{ test_type: 'Urinalysis', result: 'Abnormal - WBC present', date: '2025-09-20' }] },
  ],
};

const MOCK_DRUGS = [
  { id: 1, drug_name: 'Amoxicillin', brand_name: 'Amoxil', unit: 'tablets', stock_quantity: 240, unit_price: 5.50 },
  { id: 2, drug_name: 'Ciprofloxacin', brand_name: 'Cipro', unit: 'tablets', stock_quantity: 180, unit_price: 8.00 },
  { id: 3, drug_name: 'Paracetamol', brand_name: 'Panadol', unit: 'tablets', stock_quantity: 500, unit_price: 2.00 },
  { id: 4, drug_name: 'Metronidazole', brand_name: 'Flagyl', unit: 'tablets', stock_quantity: 200, unit_price: 4.50 },
  { id: 5, drug_name: 'Ibuprofen', brand_name: 'Brufen', unit: 'tablets', stock_quantity: 350, unit_price: 3.00 },
];

const MOCK_MY_QUEUE = [
  { appointment_id: 8, queue_number: 1, patient_name: 'Tigist Bekele', reason: 'Headache and fever', time_waiting: '2026-05-10T08:32:00.000Z', status: 'with_doctor' },
  { appointment_id: 9, queue_number: 4, patient_name: 'Almaz Worku', reason: 'Follow-up checkup', time_waiting: '2026-05-10T09:15:00.000Z', status: 'waiting' },
];

export async function getMyQueue(doctorId) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_MY_QUEUE } };
}

export async function callNextPatient(appointmentId) {
  await mockDelay(200);
  return { success: true, data: { appointment_id: appointmentId, message: 'Patient called' } };
}

export async function getConsultationData(appointmentId) {
  await mockDelay(400);
  return { success: true, data: MOCK_CONSULTATION_DATA };
}

export async function saveMedicalRecord(data) {
  await mockDelay(350);
  return { success: true, data: { id: Date.now(), ...data, recorded_at: new Date().toISOString() }, message: 'Medical record saved' };
}

export async function issuePrescription(data) {
  await mockDelay(300);
  return { success: true, data: { id: Date.now(), ...data, status: 'pending', issued_at: new Date().toISOString() }, message: 'Prescription issued' };
}

export async function submitLabRequest(data) {
  await mockDelay(300);
  return { success: true, data: { id: Date.now(), ...data, status: 'pending', created_at: new Date().toISOString() }, message: 'Lab request submitted' };
}

export async function completeConsultation(appointmentId) {
  await mockDelay(250);
  return { success: true, data: { appointment_id: appointmentId, message: 'Consultation completed' } };
}

export async function searchDrugs(query) {
  await mockDelay(200);
  if (!query) return { success: true, data: { items: MOCK_DRUGS } };
  const q = query.toLowerCase();
  const results = MOCK_DRUGS.filter(
    (d) => d.drug_name.toLowerCase().includes(q) || d.brand_name.toLowerCase().includes(q)
  );
  return { success: true, data: { items: results } };
}