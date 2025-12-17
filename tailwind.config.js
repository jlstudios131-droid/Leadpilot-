/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Principal do LeadPilot (usando tons de azul)
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Base (Botões, Ícones)
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Tons de Cinza Renomeados para 'muted' (Padrão de UI/SaaS)
        muted: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          500: '#6b7280', // Texto secundário
          700: '#374151',
          900: '#111827', // Texto principal
        },
        // Cores de Status
        success: { 500: '#22c55e', 600: '#16a34a' },
        warning: { 500: '#f59e0b', 700: '#b45309' },
        danger: { 500: '#ef4444', 600: '#dc2626' },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
          }
