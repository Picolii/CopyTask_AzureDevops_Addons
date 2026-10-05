const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const fixture = path.join(__dirname, 'copy-task-full-page.html');

http
  .createServer((request, response) => {
    const file = request.url === '/CopyTask.js'
      ? path.join(root, 'CopyTask.js')
      : fixture;

    response.setHeader(
      'Content-Type',
      file.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8',
    );

    fs.createReadStream(file).pipe(response);
  })
  .listen(4173, '127.0.0.1', () => {
    console.log('Fixture running at http://127.0.0.1:4173/_workitems/edit/123');
  });
