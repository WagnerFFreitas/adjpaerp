import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { TaxConfigProvider } from "./contexts/TaxConfigContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <TaxConfigProvider>
    <App />
  </TaxConfigProvider>
);
