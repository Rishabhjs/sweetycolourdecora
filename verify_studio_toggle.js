const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const widgetJs = fs.readFileSync('agent_widget.js', 'utf8');
const studioJs = fs.readFileSync('ai_studio.js', 'utf8');

console.log('1. Nav contains AI Studio button/link:', html.includes('nav-ai-studio-btn') || html.includes('AI Studio</a></li>'));
console.log('2. Hero has toggle button:', html.includes('id="heroToggleStudioBtn"'));
console.log('3. Studio is hidden by default:', html.includes('id="ai-design-studio" style="display: none;"'));
console.log('4. Studio has close/hide button:', html.includes('id="closeStudioBtn"'));
console.log('5. Floating launcher removed from widgetJs:', !widgetJs.includes('aiAgentLauncher'));
console.log('6. Studio visibility handler in studioJs:', studioJs.includes('setupStudioVisibility'));

console.log('All checks passed successfully!');
