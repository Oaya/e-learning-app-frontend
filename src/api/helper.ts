import axios from "axios";

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
