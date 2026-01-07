import { createRoot } from "react-dom/client";
import "./styles/index.css";

import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertProvider } from "./contexts/AlertContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </AuthProvider>
  </QueryClientProvider>,
);
