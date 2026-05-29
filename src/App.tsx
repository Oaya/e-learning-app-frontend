import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { Toaster } from "sonner";
import StudentRoutes from "./routes/StudentRoutes";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors duration={2000} offset={{ top: 64 }} />
      <Routes>
        {PublicRoutes()}
        {AdminRoutes()}
        {StudentRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
