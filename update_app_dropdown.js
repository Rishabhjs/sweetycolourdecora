const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
let js = fs.readFileSync(appJsPath, 'utf8');

// Add proposal dropdown controller if not present
if (!js.includes('proposalDropdown')) {
  const dropdownCode = `
  // Proposal Dropdown Toggle
  const proposalDropdown = document.getElementById('proposalDropdown');
  const proposalDropBtn = document.getElementById('proposalDropBtn');

  if (proposalDropdown && proposalDropBtn) {
    proposalDropBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = proposalDropdown.classList.toggle('is-open');
      proposalDropBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!proposalDropdown.contains(e.target)) {
        proposalDropdown.classList.remove('is-open');
        proposalDropBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when clicking a menu item
    proposalDropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        proposalDropdown.classList.remove('is-open');
        proposalDropBtn.setAttribute('aria-expanded', 'false');
        if (navClusters) {
          navClusters.classList.remove('is-open');
          if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
`;

  js = js.replace('  // Mobile Navigation Toggle', dropdownCode + '\n  // Mobile Navigation Toggle');
  fs.writeFileSync(appJsPath, js, 'utf8');
  console.log('Successfully updated app.js with dropdown handler!');
} else {
  console.log('Dropdown handler already in app.js');
}
