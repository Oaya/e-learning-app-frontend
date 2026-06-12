import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);

    const scroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return true;
      }
      return false;
    };

    if (scroll()) return;

    // Retry after lazy-loaded page has rendered
    const timeout = setTimeout(scroll, 300);
    return () => clearTimeout(timeout);
  }, [hash, pathname]);

  return null;
}
