export type InvoiceStatusType = "unpaid" | "paid";

export type Invoice = {
  id: string;
  amount: number;
  currency: string;
  status: InvoiceStatusType;
  due_date?: string | null;
  paid_at?: string | null;
  notes?: string | null;
  admin_id: string;
  created_at: string;
  updated_at: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  lesson: {
    id: string;
    topic: string;
    scheduled_at: string;
    duration_in_minutes: number;
  };
};

export type CreateInvoiceData = {
  lesson_id: string;
  amount: number;
  status: InvoiceStatusType;
  due_date?: string;
  notes?: string;
};
