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
        },
    },
    plugins: [],
};
