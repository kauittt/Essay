/** @type {import('tailwindcss').Config} */
export default {
    prefix: "tw-",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        colors: {},
        extend: {
            fontFamily: {
                sans: ["Roboto", "sans-serif"],
            },
            boxShadow: {
                custom: "rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px",
            },
        },
    },
    plugins: [],
};
