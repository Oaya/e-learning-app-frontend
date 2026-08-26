import axios from "axios";
import type { CreateInvoiceData } from "@/type/invoice";
import { authHeader } from "./auth";

export async function createInvoice(data: CreateInvoiceData): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/invoices`;
    const response = await axios.post(url, { invoice: data }, { headers: authHeader() });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function updateInvoice(
  id: string,
  data: Partial<CreateInvoiceData> & { paid_at?: string },
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/invoices/${id}`;
    const response = await axios.patch(url, { invoice: data }, { headers: authHeader() });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function getInvoices(params?: {
  lesson_id?: string;
  student_id?: string;
}): Promise<ApiResponse> {
  try {
    const query = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    const url = `${import.meta.env.VITE_API_URL}/api/invoices${query}`;
    const response = await axios.get(url, { headers: authHeader() });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function deleteInvoice(id: string): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/invoices/${id}`;
    await axios.delete(url, { headers: authHeader() });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}
