import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Header from "./components/layouts/Header";
import HomePage from "./pages/Home";
import PricingPage from "./pages/Pricing";
import SignupPage from "./pages/Signup";
import EmailConfirmPage from "./pages/EmailConfirm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/pricing" element={<PricingPage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="confirm-email" element={<EmailConfirmPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
