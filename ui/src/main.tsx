import React from "react";
import ReactDOM from "react-dom/client";
import { AppShell } from "./components/AppShell";
import "./styles/tokens.css";
import "./styles/app.css";
import "reactflow/dist/style.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AppShell />
  </React.StrictMode>
);
