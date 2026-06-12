import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import ScrollToHash from "../utils/ScrollToHash";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ScrollToHash />

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
