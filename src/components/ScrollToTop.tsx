import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Defer so the target element is mounted
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
        } else {
          window.scrollTo({ top: 0, left: 0 });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
