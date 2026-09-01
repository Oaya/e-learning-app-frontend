import axios from "axios";

// Skip ngrok browser warning interstitial for API requests
axios.defaults.headers.common["ngrok-skip-browser-warning"] = "true";

export function unwrapResponse<T>(res: ApiResponse): T {
  if (!res.success) {
    throw new Error(res.error || "Request failed");
  }
  return res.data as T;
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as any;

    // Your backend uses render_error(...) so likely { error: ... }
    const backendError = data?.error ?? data?.message ?? data?.errors;

    if (typeof backendError === "string") return backendError;
    if (Array.isArray(backendError)) return backendError.join(", ");
    if (backendError && typeof backendError === "object")
      return JSON.stringify(backendError);

    // Fallback to Axios message (e.g. Network Error)
    return err.message || "Request failed";
  }

  if (err instanceof Error) return err.message;
  return "Something went wrong";
}
