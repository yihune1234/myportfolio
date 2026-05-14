/**
 * Mock reception service — patient search, register, check-in, queue.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_PATIENTS = [
  { id: 11, university_id: 'UNI-2021-0041', first_name: 'Almaz', last_name: 'Worku', gender: 'female', date_of_birth: '1999-02-20', contact: '+251911111111', patient_type: 'student', campus_id: 1 },
  { id: 12, university_id: 'UNI-2021-0042', first_name: 'Tigist', last_name: 'Bekele', gender: 'female', date_of_birth: '1998-04-15', contact: '+251912345678', patient_type: 'student', campus_id: 1 },
  { id: 13, university_id: 'UNI-2022-0051', first_name: 'Ephrem', last_name: 'Desta', gender: 'male', date_of_birth: '2000-11-08', contact: '+251922222222', patient_type: 'student', campus_id: 2 },
  { id: 14, university_id: 'STAFF-001', first_name: 'Mulugeta', last_name: 'Assefa', gender: 'male', date_of_birth: '1985-07-30', contact: '+251933333333', patient_type: 'staff', campus_id: 1 },
  { id: 15, university_id: null, first_name: 'Hiwot', last_name: 'Eshetu', gender: 'female', date_of_birth: '2001-12-01', contact: '+251944444444', patient_type: 'student', campus_id: 1 },
];

const MOCK_QUEUE = [
  { id: 1, queue_number: 1, patient_id: 12, patient_name: 'Tigist Bekele', appointment_id: 8, doctor_name: 'Dr. Samuel Tesfaye', room_name: 'Consultation Room 1', pathway: 'walk_in', status: 'waiting', created_at: '2026-05-10T08:32:00.000Z' },
  { id: 2, queue_number: 2, patient_id: 11, patient_name: 'Almaz Worku', appointment_id: 9, doctor_name: 'Dr. Samuel Tesfaye', room_name: 'Consultation Room 1', pathway: 'nurse_first', status: 'with_nurse', created_at: '2026-05-10T08:45:00.000Z' },
  { id: 3, queue_number: 3, patient_id: 13, patient_name: 'Ephrem Desta', appointment_id: 10, doctor_name: 'Dr. Yonas Ayele', room_name: 'Consultation Room 2', pathway: 'walk_in', status: 'waiting', created_at: '2026-05-10T09:00:00.000Z' },
];

const MOCK_AVAILABLE_DOCTORS = [
  { staff_id: 3, full_name: 'Dr. Samuel Tesfaye', specialty: 'General Practice', work_area_id: 2, room_name: 'Consultation Room 1', current_queue_count: 4 },
  { staff_id: 8, full_name: 'Dr. Yonas Ayele', specialty: 'Internal Medicine', work_area_id: 3, room_name: 'Consultation Room 2', current_queue_count: 2 },
  { staff_id: 9, full_name: 'Dr. Meseret Abebe', specialty: 'Pediatrics', work_area_id: 4, room_name: 'Consultation Room 3', current_queue_count: 1 },
];

const MOCK_AVAILABLE_NURSES = [
  { staff_id: 4, full_name: 'Meron Alemayehu' },
  { staff_id: 10, full_name: 'Tsion Haile' },
];

export async function searchPatients(query) {
  await mockDelay(300);
  if (!query || query.length < 2) return { success: true, data: { items: [] } };
  const q = query.toLowerCase();
  const results = MOCK_PATIENTS.filter(
    (p) =>
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      (p.university_id && p.university_id.toLowerCase().includes(q))
  );
  return { success: true, data: { items: results } };
}

export async function registerPatient(data) {
  await mockDelay(400);
  const newPatient = {
    id: MOCK_PATIENTS.length + 1,
    university_id: data.university_id || null,
    first_name: data.first_name,
    last_name: data.last_name,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    contact: data.contact,
    patient_type: data.patient_type,
    campus_id: data.campus_id,
  };
  return { success: true, data: newPatient, message: 'Patient registered successfully' };
}

export async function checkIn(data) {
  await mockDelay(350);
  const queueEntry = {
    id: MOCK_QUEUE.length + 1,
    queue_number: MOCK_QUEUE.length + 1,
    patient_id: data.patientId,
    patient_name: 'Patient',
    appointment_id: Date.now(),
    doctor_name: data.doctorId ? 'Dr. Assigned' : 'TBD',
    room_name: 'Assigned Room',
    pathway: data.pathway,
    status: 'waiting',
    created_at: new Date().toISOString(),
  };
  return { success: true, data: queueEntry, message: `Check-in successful. Queue #${queueEntry.queue_number}` };
}

export async function getAvailableDoctors(clinicId) {
  await mockDelay(250);
  return { success: true, data: { items: MOCK_AVAILABLE_DOCTORS } };
}

export async function getAvailableNurses() {
  await mockDelay(200);
  return { success: true, data: { items: MOCK_AVAILABLE_NURSES } };
}

export async function getQueue(clinicId, date) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_QUEUE } };
}

export async function cancelQueueEntry(queueId) {
  await mockDelay(200);
  return { success: true, data: { message: 'Queue entry cancelled' } };
}