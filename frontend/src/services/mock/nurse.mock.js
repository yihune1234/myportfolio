/**
 * Mock nurse service — vitals queue, record vitals, route to doctor.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_VITALS_QUEUE = [
  { appointment_id: 9, queue_number: 2, patient_id: 11, patient_name: 'Almaz Worku', patient_type: 'student', reason: 'Headache and fever', arrived_at: '2026-05-10T08:45:00.000Z' },
  { appointment_id: 11, queue_number: 5, patient_id: 15, patient_name: 'Hiwot Eshetu', patient_type: 'student', reason: 'Annual checkup', arrived_at: '2026-05-10T09:30:00.000Z' },
];

export async function getVitalsQueue(clinicId) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_VITALS_QUEUE } };
}

export async function recordVitals(data) {
  await mockDelay(350);
  return {
    success: true,
    data: {
      id: Date.now(),
      patient_id: data.patientId,
      appointment_id: data.appointmentId,
      bp_systolic: data.bp_systolic,
      bp_diastolic: data.bp_diastolic,
      temperature: data.temperature,
      pulse_rate: data.pulse_rate,
      weight: data.weight,
      height: data.height,
      recorded_at: new Date().toISOString(),
    },
    message: 'Vitals recorded successfully',
  };
}

export async function routeToDoctor(data) {
  await mockDelay(300);
  return { success: true, data: { message: 'Patient routed to doctor queue' } };
}