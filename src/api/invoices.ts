import axios from "axios";
import type { CreateInvoiceData } from "@/type/invoice";
import { authHeader } from "./auth";

export async function createInvoice(
  data: CreateInvoiceData,
): Promise<ApiResponse> {
  try {
    const url = `${import.meta.env.VITE_API_URL}/api/invoices`;
    const response = await axios.post(
      url,
      { invoice: data },
      { headers: authHeader() },
    );
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
    const response = await axios.patch(
      url,
      { invoice: data },
      { headers: authHeader() },
    );
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function getInvoices(studentId?: string): Promise<ApiResponse> {
  try {
    const url: string = `${import.meta.env.VITE_API_URL}/api/invoices${
      studentId ? `?student_id=${studentId}` : ""
    }`;
    const response = await axios.get(url, { headers: authHeader() });
    return { success: true, data: response.data };
  } catch (err: any) {
    return { success: false, error: err.response?.data?.error };
  }
}

export async function getInvoiceById(id: string): Promise<ApiResponse> {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/invoices/${id}`,
      { headers: authHeader() },
    );
    return { success: true, data: res.data };
  } catch (e: any) {
    return { success: false, error: e.response?.data?.error };
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
