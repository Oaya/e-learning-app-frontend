import { BrowserRouter, Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {PublicRoutes()}
        {AdminRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
