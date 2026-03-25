import { createRoot } from "react-dom/client";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import App from "./App.tsx";
import "./index.css";

// Capture PWA install prompt for use in Profile page
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  (window as any).deferredPWAPrompt = e;
});

createRoot(document.getElementById("root")!).render(<App />);
