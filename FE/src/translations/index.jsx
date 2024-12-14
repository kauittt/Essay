import resources from "./resources";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const config = {
    resources,
    lng: "vn",
    fallbackLng: "en",
    ns: ["common", "errors", "store"],
    defaultNS: "common",
    interpolation: {
        escapeValue: false,
    },
    debug: false,
};

i18n.use(initReactI18next).init(config);

export default i18n;
