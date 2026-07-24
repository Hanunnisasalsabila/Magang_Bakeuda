const axios = require('axios');
const fs = require('fs');

async function test() {
  const token = fs.readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('JWT_SECRET=')).split('=')[1];
  // Actually I don't know the exact token. Let's just write a script in NestJS.
}
