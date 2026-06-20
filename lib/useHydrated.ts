"use client";

import { useSyncExternalStore } from "react";

// A no-op store: the value never changes after the initial client render, so we
// never need to notify subscribers.
const emptySubscribe = () => () => {};

/**
 * Returns `false` during server rendering and the first (hydration) client
 * render, then `true` once the component has hydrated on the client.
 *
 * This is the hydration-safe replacement for the common
 * `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])`
 * pattern. Because it relies on `useSyncExternalStore`'s server snapshot during
 * hydration, the server and first client render agree (no hydration mismatch),
 * and it avoids the `react-hooks/set-state-in-effect` lint error caused by
 * calling `setState` synchronously inside an effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // client snapshot
    () => false // server snapshot
  );
}
