/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    900: '#881337',
                },
                pop: {
                    yellow: '#fef08a',
                    green: '#bbf7d0',
                    blue: '#bfdbfe',
                    purple: '#e9d5ff',
                    pink: '#fbcfe8',
                    orange: '#fed7aa',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Franklin Gothic Medium', 'Arial Narrow', 'sans-serif'],
            },
            boxShadow: {
                'hard': '4px 4px 0px 0px #000000',
                'hard-sm': '2px 2px 0px 0px #000000',
                'hard-lg': '8px 8px 0px 0px #000000',
            }
        },
    },
    plugins: [],
}
