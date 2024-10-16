import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./containers/App/App";
import "regenerator-runtime/runtime";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    // </StrictMode>
    <App />
);
