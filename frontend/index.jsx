import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles.css";

import EZbootApp from "@/EZbootApp.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <EZbootApp />
  </StrictMode>
);
