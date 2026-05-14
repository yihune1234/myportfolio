/**
 * Mock pharmacist service — prescriptions, dispense, inventory, alerts.
 */
import { mockDelay } from '@/lib/mockDelay';

const MOCK_PRESCRIPTIONS = [
  { id: 7, patient_name: 'Tigist Bekele', doctor_name: 'Dr. Samuel Tesfaye', drug_id: 1, drug_name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration_days: 7, special_instructions: 'Take with food', status: 'pending', stock_quantity: 240, expiry_date: '2027-03-01', unit_price: 5.50 },
  { id: 8, patient_name: 'Almaz Worku', doctor_name: 'Dr. Samuel Tesfaye', drug_id: 5, drug_name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily', duration_days: 5, special_instructions: '', status: 'pending', stock_quantity: 350, expiry_date: '2027-06-15', unit_price: 3.00 },
  { id: 9, patient_name: 'Ephrem Desta', doctor_name: 'Dr. Yonas Ayele', drug_id: 3, drug_name: 'Paracetamol', dosage: '500mg', frequency: 'Three times daily', duration_days: 3, special_instructions: 'Do not exceed 6 tablets daily', status: 'pending', stock_quantity: 500, expiry_date: '2028-01-20', unit_price: 2.00 },
];

const MOCK_INVENTORY = [
  { id: 1, drug_name: 'Amoxicillin', brand_name: 'Amoxil', batch_number: 'BATCH-2024-AMX-001', unit: 'tablets', stock_quantity: 240, minimum_stock: 50, unit_price: 5.50, expiry_date: '2027-03-01', status: 'active' },
  { id: 2, drug_name: 'Ciprofloxacin', brand_name: 'Cipro', batch_number: 'BATCH-2024-CIP-002', unit: 'tablets', stock_quantity: 180, minimum_stock: 50, unit_price: 8.00, expiry_date: '2027-05-15', status: 'active' },
  { id: 3, drug_name: 'Paracetamol', brand_name: 'Panadol', batch_number: 'BATCH-2024-PAR-003', unit: 'tablets', stock_quantity: 500, minimum_stock: 100, unit_price: 2.00, expiry_date: '2028-01-20', status: 'active' },
  { id: 4, drug_name: 'Metronidazole', brand_name: 'Flagyl', batch_number: 'BATCH-2024-MET-004', unit: 'tablets', stock_quantity: 200, minimum_stock: 50, unit_price: 4.50, expiry_date: '2027-08-10', status: 'active' },
  { id: 5, drug_name: 'Ibuprofen', brand_name: 'Brufen', batch_number: 'BATCH-2024-IBU-005', unit: 'tablets', stock_quantity: 35, minimum_stock: 50, unit_price: 3.00, expiry_date: '2027-06-15', status: 'active' },
  { id: 6, drug_name: 'Insulin Regular', brand_name: 'Humulin R', batch_number: 'BATCH-2024-INS-006', unit: 'vials', stock_quantity: 10, minimum_stock: 20, unit_price: 150.00, expiry_date: '2026-06-01', status: 'active' },
];

export async function getPendingPrescriptions(pharmacistId) {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_PRESCRIPTIONS } };
}

export async function dispensePrescription(data) {
  await mockDelay(350);
  return { success: true, data: { id: data.prescriptionId, status: 'dispensed', quantity: data.quantity, message: 'Prescription dispensed' } };
}

export async function getInventory() {
  await mockDelay(300);
  return { success: true, data: { items: MOCK_INVENTORY } };
}

export async function addDrugStock(data) {
  await mockDelay(300);
  return { success: true, data: { id: Date.now(), ...data, message: 'Stock added successfully' } };
}

export async function updateDrugStock(data) {
  await mockDelay(250);
  return { success: true, data: { ...data, message: 'Stock updated successfully' } };
}

export async function getAlerts() {
  await mockDelay(200);
  const lowStock = MOCK_INVENTORY.filter((item) => item.stock_quantity < item.minimum_stock);
  const expiringSoon = MOCK_INVENTORY.filter((item) => {
    const daysUntilExpiry = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  });
  return { success: true, data: { low_stock: lowStock, expiring_soon: expiringSoon } };
}