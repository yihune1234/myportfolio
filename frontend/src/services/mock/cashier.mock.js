/**
 * Mock cashier service — unpaid bills, bill detail, process payment, history.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_BILLS = [
  {
    id: 4, patient_id: 12, patient_name: 'Tigist Bekele', appointment_id: 8,
    total_amount: 285.00, amount_paid: 0.00, balance_due: 285.00, status: 'unpaid',
    line_items: [
      { type: 'consultation', description: 'OPD Consultation', amount: 150.00 },
      { type: 'lab', description: 'Full Blood Count', amount: 85.00 },
      { type: 'pharmacy', description: 'Amoxicillin 500mg x 21 tabs', amount: 50.00 },
    ],
    generated_at: '2026-05-10T10:45:00.000Z',
  },
  {
    id: 5, patient_id: 11, patient_name: 'Almaz Worku', appointment_id: 9,
    total_amount: 150.00, amount_paid: 100.00, balance_due: 50.00, status: 'partial',
    line_items: [
      { type: 'consultation', description: 'OPD Consultation', amount: 150.00 },
    ],
    generated_at: '2026-05-10T09:30:00.000Z',
  },
  {
    id: 6, patient_id: 13, patient_name: 'Ephrem Desta', appointment_id: 10,
    total_amount: 430.00, amount_paid: 0.00, balance_due: 430.00, status: 'unpaid',
    line_items: [
      { type: 'consultation', description: 'OPD Consultation', amount: 150.00 },
      { type: 'lab', description: 'Urinalysis', amount: 80.00 },
      { type: 'pharmacy', description: 'Paracetamol 500mg x 9 tabs', amount: 20.00 },
      { type: 'pharmacy', description: 'Ciprofloxacin 500mg x 10 tabs', amount: 180.00 },
    ],
    generated_at: '2026-05-10T11:00:00.000Z',
  },
];

export async function getUnpaidBills(cashierId) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_BILLS } };
}

export async function getBillDetail(billId) {
  await mockDelay(250);
  const bill = MOCK_BILLS.find((b) => b.id === Number(billId));
  if (!bill) throw new Error('Bill not found');
  return { success: true, data: bill };
}

export async function processPayment(data) {
  await mockDelay(350);
  return {
    success: true,
    data: {
      id: data.billId,
      amount_paid: data.amount_paid,
      payment_method: data.payment_method,
      reference_number: data.reference_number || null,
      status: data.amount_paid >= 285 ? 'paid' : 'partial',
      processed_at: new Date().toISOString(),
      receipt_number: `RCP-${Date.now()}`,
    },
    message: 'Payment processed successfully',
  };
}

export async function getPaymentHistory(billId) {
  await mockDelay(200);
  return { success: true, data: { items: [] } };
}