import resources from "./resources";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const config = {
    resources,
    lng: "en", // Default language
    fallbackLng: "en", // Use English if the detection fails
    ns: ["common", "errors"], // Define available namespaces
    defaultNS: "common", // Default namespace
    interpolation: {
        escapeValue: false, // Not needed for React, it escapes by default
    },
    debug: false, // Toggle to see debug information in the console
};

i18n.use(initReactI18next).init(config);

export default i18n;
