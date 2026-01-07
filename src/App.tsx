import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors duration={3000} />
      <Routes>
        {PublicRoutes()}
        {AdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
