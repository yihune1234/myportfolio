/**
 * Real reception API service — patients, check-in, queue endpoints.
 */
import axiosInstance from '@/lib/axiosInstance';

export async function searchPatients(query) {
  const response = await axiosInstance.get('/patients/search', { params: { q: query } });
  return response.data;
}

export async function registerPatient(data) {
  const response = await axiosInstance.post('/patients', data);
  return response.data;
}

export async function checkIn(data) {
  const response = await axiosInstance.post('/checkin', data);
  return response.data;
}

export async function getAvailableDoctors(clinicId) {
  const response = await axiosInstance.get('/staff/available-doctors', { params: { clinic_id: clinicId } });
  return response.data;
}

export async function getQueue(clinicId, date) {
  const response = await axiosInstance.get('/queue', { params: { clinic_id: clinicId, date } });
  return response.data;
}

export async function cancelQueueEntry(queueId) {
  const response = await axiosInstance.put(`/queue/${queueId}/cancel`);
  return response.data;
}