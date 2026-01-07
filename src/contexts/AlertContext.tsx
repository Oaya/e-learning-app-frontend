import { createContext, useContext, useMemo, type ReactNode } from "react";
import { toast } from "sonner";

type AlertContextType = {
  success: (message: string, opts?: { description?: string }) => void;
  error: (message: string, opts?: { description?: string }) => void;
  info: (message: string, opts?: { description?: string }) => void;
  warning: (message: string, opts?: { description?: string }) => void;
};

const AlertContext = createContext<AlertContextType>({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

export function AlertProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AlertContextType>(
    () => ({
      success: (message, opts) =>
        toast.success(message, { description: opts?.description }),
      error: (message, opts) =>
        toast.error(message, { description: opts?.description }),
      info: (message, opts) =>
        toast(message, { description: opts?.description }),
      warning: (message, opts) =>
        toast.warning(message, { description: opts?.description }),
    }),
    [],
  );

  return <AlertContext value={value}>{children}</AlertContext>;
}

export function useAlert() {
  return useContext(AlertContext);
}
