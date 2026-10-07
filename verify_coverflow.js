const http = require('http');

function checkServer(port) {
  return new Promise((resolve) => {
    http.get('http://localhost:' + port + '/', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Port ' + port + ' Status: ' + res.statusCode);
        console.log('Has coverflow-carousel:', data.includes('coverflow-carousel'));
        console.log('Has cf-stage-wrap:', data.includes('cf-stage-wrap'));
        console.log('Has 6 trade cards in coverflow:', (data.match(/class="cf-card"/g) || []).length === 6);
        console.log('Has proposalDropdown:', data.includes('id="proposalDropdown"'));
        console.log('Has Why it matters:', data.includes('Why it matters'));
        console.log('Has Group 9:', data.includes('Group 9'));
        resolve(res.statusCode);
      });
    }).on('error', (err) => {
      console.log('Port ' + port + ' Error: ' + err.message);
      resolve(null);
    });
  });
}

async function run() {
  await checkServer(3000);
  console.log('---');
  await checkServer(8080);
}
run();
