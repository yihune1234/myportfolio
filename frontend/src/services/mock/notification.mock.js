/**
 * Mock notification service — get notifications, mark read, mark all read.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'lab_result', title: 'Lab Result Ready', message: 'FBC result for Tigist Bekele is ready', is_read: false, created_at: '2026-05-10T10:30:00.000Z' },
  { id: 2, type: 'prescription', title: 'Prescription Issued', message: 'New prescription issued for Almaz Worku', is_read: false, created_at: '2026-05-10T10:15:00.000Z' },
  { id: 3, type: 'check_in', title: 'Patient Checked In', message: 'Ephrem Desta checked in for Dr. Yonas', is_read: true, created_at: '2026-05-10T09:00:00.000Z' },
];

export async function getNotifications() {
  await mockDelay(200);
  return { success: true, data: { notifications: MOCK_NOTIFICATIONS } };
}

export async function markAsRead(id) {
  await mockDelay(150);
  return { success: true, data: { message: 'Notification marked as read' } };
}

export async function markAllAsRead() {
  await mockDelay(200);
  return { success: true, data: { message: 'All notifications marked as read' } };
}