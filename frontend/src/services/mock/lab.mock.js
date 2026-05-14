/**
 * Mock lab service — pending requests, start test, submit results, cancel.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_LAB_REQUESTS = [
  { id: 3, patient_id: 12, patient_name: 'Tigist Bekele', test_type: 'Full Blood Count', doctor_name: 'Dr. Samuel Tesfaye', clinical_notes: 'Fever for 3 days. Suspect infection.', status: 'pending', created_at: '2026-05-10T09:10:00.000Z' },
  { id: 4, patient_id: 11, patient_name: 'Almaz Worku', test_type: 'Malaria Rapid Test', doctor_name: 'Dr. Samuel Tesfaye', clinical_notes: 'Intermittent fever, chills.', status: 'pending', created_at: '2026-05-10T09:25:00.000Z' },
  { id: 5, patient_id: 13, patient_name: 'Ephrem Desta', test_type: 'Urinalysis', doctor_name: 'Dr. Yonas Ayele', clinical_notes: 'Lower abdominal pain, dysuria.', status: 'in_progress', created_at: '2026-05-10T08:50:00.000Z' },
];

export async function getPendingRequests(labId) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_LAB_REQUESTS } };
}

export async function startTest(requestId) {
  await mockDelay(250);
  return { success: true, data: { id: requestId, status: 'in_progress', message: 'Test started' } };
}

export async function submitResults(data) {
  await mockDelay(350);
  return { success: true, data: { id: data.requestId, status: 'completed', result_data: data.result_data, submitted_at: new Date().toISOString() }, message: 'Results submitted successfully' };
}

export async function cancelRequest(requestId, reason) {
  await mockDelay(200);
  return { success: true, data: { id: requestId, status: 'cancelled', reason }, message: 'Lab request cancelled' };
}