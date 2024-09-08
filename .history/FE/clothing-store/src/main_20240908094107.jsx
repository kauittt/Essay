import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import App from "./containers/App/App";
// import { config as i18nextConfig } from "./translations";
// import i18n from "i18next";
// import { I18nextProvider, initReactI18next } from "react-i18next";

// i18n.use(initReactI18next).init(i18nextConfig);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);
