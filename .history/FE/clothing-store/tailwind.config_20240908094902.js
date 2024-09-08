/** @type {import('tailwindcss').Config} */
export default {
    prefix: "tw-", // Keep your prefix
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                load: {
                    "0%": { transform: "rotate(0deg) scale(2)" },
                    "100%": { transform: "rotate(360deg) scale(2)" },
                },
                loaded: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
            },
            animation: {
                load: "load 2s linear infinite",
                loaded: "loaded 0.5s ease",
            },
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
            },
        },
    },
    plugins: [],
};
