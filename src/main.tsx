import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  console.log("Root element found, rendering App...");
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Error rendering app:", error);
  document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Erro ao carregar aplicação</h1><p>${error}</p></div>`;
}
