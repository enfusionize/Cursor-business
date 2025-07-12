const axios = require('axios');

const API_BASE = 'http://localhost:3001/api/v1';

// Test data
const testUser = {
  email: 'test@shiftframework.com',
  name: 'Test User',
  password: 'testpassword123'
};

let authToken = null;
let userId = null;
let spaceId = null;

async function testSpaceManagement() {
  console.log('🧪 Testing SHIFT Framework Space Management System...\n');

  try {
    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    authToken = registerResponse.data.token;
    userId = registerResponse.data.user.id;
    spaceId = registerResponse.data.activeSpace.spaceId;
    console.log('✅ User registered successfully');
    console.log(`   User ID: ${userId}`);
    console.log(`   Initial Space ID: ${spaceId}\n`);

    // Test 2: User Login
    console.log('2️⃣ Testing User Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User login successful\n');

    // Test 3: Get User Spaces
    console.log('3️⃣ Testing Get User Spaces...');
    const spacesResponse = await axios.get(`${API_BASE}/spaces`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${spacesResponse.data.count} spaces\n`);

    // Test 4: Create New Space
    console.log('4️⃣ Testing Create New Space...');
    const newSpaceData = {
      name: 'Test Career Space',
      description: 'A test space for career development',
      config: {
        theme: 'corporate',
        features: {
          mentalModels: true,
          journal: true,
          analytics: true,
          bookReader: true
        }
      }
    };
    
    const createSpaceResponse = await axios.post(`${API_BASE}/spaces/create`, newSpaceData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const newSpaceId = createSpaceResponse.data.space.spaceId;
    console.log('✅ New space created successfully');
    console.log(`   New Space ID: ${newSpaceId}\n`);

    // Test 5: Switch Space
    console.log('5️⃣ Testing Space Switching...');
    await axios.post(`${API_BASE}/spaces/switch/${newSpaceId}`, {}, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Space switched successfully\n');

    // Test 6: Get Space Features
    console.log('6️⃣ Testing Get Space Features...');
    const featuresResponse = await axios.get(`${API_BASE}/spaces/${newSpaceId}/features`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Space features retrieved');
    console.log(`   Theme: ${featuresResponse.data.theme}`);
    console.log(`   Features enabled: ${Object.keys(featuresResponse.data.features).filter(k => featuresResponse.data.features[k]).length}\n`);

    // Test 7: Update Space Configuration
    console.log('7️⃣ Testing Update Space Configuration...');
    const updateConfig = {
      features: {
        mentalModels: true,
        journal: false,
        analytics: true,
        bookReader: true
      }
    };
    
    await axios.put(`${API_BASE}/spaces/${newSpaceId}/config`, updateConfig, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Space configuration updated\n');

    // Test 8: Add Journal Entry
    console.log('8️⃣ Testing Add Journal Entry...');
    const journalEntry = {
      content: 'This is a test journal entry for the space management system.',
      mood: 8,
      tags: ['test', 'space-management']
    };
    
    const journalResponse = await axios.post(`${API_BASE}/spaces/${newSpaceId}/journal`, journalEntry, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Journal entry added successfully\n');

    // Test 9: Get Space Analytics
    console.log('9️⃣ Testing Get Space Analytics...');
    const analyticsResponse = await axios.get(`${API_BASE}/spaces/${newSpaceId}/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Space analytics retrieved');
    console.log(`   Journal entries: ${analyticsResponse.data.journalCount}`);
    console.log(`   Current day: ${analyticsResponse.data.progress.currentDay}\n`);

    // Test 10: Create Space from Template
    console.log('🔟 Testing Create Space from Template...');
    const templateResponse = await axios.post(`${API_BASE}/spaces/templates/personal`, {
      name: 'Template Test Space',
      description: 'Created from personal template'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Template space created successfully');
    console.log(`   Template Space ID: ${templateResponse.data.space.spaceId}\n`);

    console.log('🎉 All tests passed! Space Management System is working correctly.');
    console.log('\n📊 Summary:');
    console.log(`   - User registration and authentication: ✅`);
    console.log(`   - Space creation and management: ✅`);
    console.log(`   - Feature control system: ✅`);
    console.log(`   - Progress tracking: ✅`);
    console.log(`   - Analytics: ✅`);
    console.log(`   - Template system: ✅`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.error || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure MongoDB is running');
    console.log('2. Check that the backend server is running on port 3001');
    console.log('3. Verify environment variables are set correctly');
    console.log('4. Check network connectivity');
  }
}

// Run the tests
testSpaceManagement();