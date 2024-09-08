import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import { config as i18nextConfig } from "./translations";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init(i18nextConfig);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <App />
            </I18nextProvider>
        </Provider>
    </StrictMode>
);
