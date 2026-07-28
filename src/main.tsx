/**
 * Entry point untuk build standar (mis. Vercel).
 * Lingkungan Figma Make memakai __figma__entrypoint__.ts secara terpisah,
 * jadi file ini tidak mengganggu mode Make.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Elemen #root tidak ditemukan di index.html");

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
