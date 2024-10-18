import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./containers/App/App";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    // </StrictMode>
    <App />
);