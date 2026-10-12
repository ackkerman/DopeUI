// This file guarantees document fragments resolve after React mounts without remounting the page.
import { useEffect } from "react";

export function useDocumentAnchor() {
  useEffect(() => {
    let active = true;
    let frame = 0;
    const reveal = () => {
      if (!active || !window.location.hash) return;
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      // Missing or malformed fragments preserve the current document position.
      if (typeof target?.scrollIntoView === "function")
        target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const schedule = () => {
      if (typeof window.requestAnimationFrame !== "function") {
        reveal();
        return;
      }
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(reveal);
    };
    schedule();
    const initialHash = window.location.hash;
    document.fonts?.ready.then(() => {
      if (window.location.hash === initialHash) schedule();
    });
    window.addEventListener("hashchange", schedule);
    return () => {
      active = false;
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", schedule);
    };
  }, []);
}
