const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app.js');
let js = fs.readFileSync(filePath, 'utf8');

if (!js.includes('themeToggle')) {
  const themeToggleCode = `
  // Niveeta Theme Controller (Dark Obsidian default vs Plaster Light)
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('scd_theme');

  // Check saved theme or system preference
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else {
    // Default to dark luxury architectural mode (Niveeta aesthetic)
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('scd_theme', newTheme);
    });
  }
`;
  // Insert before DOMContentLoaded closing brace
  js = js.replace('  // Dynamic Current Year', themeToggleCode + '\n  // Dynamic Current Year');
  fs.writeFileSync(filePath, js, 'utf8');
  console.log('Successfully updated app.js with theme toggle logic!');
} else {
  console.log('Theme toggle logic already present in app.js.');
}
