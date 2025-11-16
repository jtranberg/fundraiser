// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // no extension needed, TS resolves .tsx
import "./App.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
