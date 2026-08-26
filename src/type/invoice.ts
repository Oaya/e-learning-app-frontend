export type InvoiceStatusType = "unpaid" | "paid";

export type Invoice = {
  id: string;
  amount: number;
  currency: string;
  status: InvoiceStatusType;
  due_date?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  lesson_id: string;
  student_id: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
};

export type CreateInvoiceData = {
  lesson_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatusType;
  due_date?: string;
  notes?: string;
};
