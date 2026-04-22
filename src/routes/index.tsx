import { createFileRoute } from "@tanstack/react-router";
import App from "@/App";

export const Route = createFileRoute("/")({
  component: App,
  // App is fully client-side (localStorage, audio, canvas). Skip SSR to avoid
  // hydration mismatches and to ship the initial paint faster.
  ssr: false,
});
