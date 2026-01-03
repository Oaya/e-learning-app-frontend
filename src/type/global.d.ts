import type { AxiosError } from "axios";

declare global {
  interface ApiResponse {
    success: boolean;
    data?: any;
    error?: AxiosError | string;
    status?: number;
  }
}

export {};
