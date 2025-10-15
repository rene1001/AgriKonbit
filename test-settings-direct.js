const axios = require('axios');

async function testSettingsDirect() {
  console.log('🔍 Testing settings endpoints directly on port 3001...\n');
  
  const endpoints = [
    'http://localhost:3001/api/settings',
    'http://localhost:3001/api/settings/project_video_url',
    'http://localhost:3001/api/settings/project_video_title'
  ];
  
  for (const url of endpoints) {
    try {
      console.log(`Testing: ${url}`);
      const response = await axios.get(url, {
        timeout: 3000,
        validateStatus: () => true
      });
      
      console.log(`  Status: ${response.status} ${response.status === 200 ? '✅' : '❌'}`);
      
      if (response.status === 200) {
        console.log(`  Response:`, JSON.stringify(response.data, null, 2));
      } else {
        console.log(`  Error:`, response.data);
      }
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.code || error.message}\n`);
    }
  }
  
  console.log('⚠️  If you see 500 errors, the backend server needs to be restarted!');
  console.log('   Run: npm start (in the server directory)');
}

if (require.main === module) {
  testSettingsDirect()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = testSettingsDirect;
