import resources from "./resources";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const config = {
    resources,
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "errors"],
    defaultNS: "common",
    interpolation: {
        escapeValue: false,
    },
    debug: false,
};

i18n.use(initReactI18next).init(config);

export default i18n;
