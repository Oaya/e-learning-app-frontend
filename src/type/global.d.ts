import type { AxiosError } from "axios";

declare global {
  interface ApiResponse {
    success: boolean;
    data?: any;
    error?: string;
    status?: number;
  }
}

export {};
