export default {
  // PostCSS plugins to process your Tailwind CSS for maximum browser compatibility
  plugins: {
    // Processes the tailwind.config.js logic
    tailwindcss: {},
    
    // Automatically adds vendor prefixes (-webkit-, -moz-) to your CSS 
    // essential for smooth animations and flexbox/grid on older browsers
    autoprefixer: {},
    
    // Future-proof: You could add cssnano here in the future for extreme minification,
    // but Vite handles this automatically during 'npm run build'.
  },
}
