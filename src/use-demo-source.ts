// This file loads copyable source on demand while keeping the live preview immediately available.
import { useEffect, useState } from "react";
import type { MotionDemo } from "./catalog";
import { getDemoSource, type DemoSource } from "./demo-source";
const cache = new Map<string, DemoSource>();
export function useDemoSource(demo: MotionDemo | null, enabled = true) {
  const [result, setResult] = useState<{
    id: string;
    source?: DemoSource;
    error?: string;
  }>(() => ({
    id: demo?.id ?? "",
    source: demo ? cache.get(demo.id) : undefined,
  }));
  useEffect(() => {
    if (!demo || !enabled) return;
    let cancelled = false;
    getDemoSource(demo)
      .then((source) => {
        cache.set(demo.id, source);
        if (!cancelled) setResult({ id: demo.id, source });
      })
      .catch(() => {
        if (!cancelled)
          setResult({
            id: demo.id,
            error:
              "Could not load the source. Please reload the page to retry.",
          });
      });
    return () => {
      cancelled = true;
    };
  }, [demo, enabled]);
  const current = result.id === demo?.id ? result : null;
  const source = current?.source ?? (demo ? cache.get(demo.id) : undefined);
  return {
    source: source ?? (demo ? { React: "", CSS: "" } : null),
    loading: Boolean(enabled && demo && !source && !current?.error),
    error: current?.error,
  };
}
