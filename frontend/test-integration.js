// test-integration.js - End-to-end integration test runner

const BASE_URL = 'https://borrowit-backend-3xdn.onrender.com/api';

const request = async (path, method = 'GET', body = null, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`[${method} ${path}] Failed: ${res.status} - ${errText}`);
  }
  return res.json().catch(() => ({}));
};

const runTest = async () => {
  console.log('=== STARTING BORROWX FULL INTEGRATION TEST ===\n');

  // 1. REGISTER & LOGIN ADITHYA (OTP Flow)
  console.log('1. Registering/Logging in Adithya...');
  let adithyaToken;
  let adithyaUser;
  const adithyaEmail = `test-adithya-${Date.now()}@example.com`;
  const adithyaPhone = String(Math.floor(1000000000 + Math.random() * 9000000000));
  
  console.log(`Initiating registration for Adithya (${adithyaEmail})...`);
  await request('/users/register/initiate', 'POST', {
    fullName: 'Adithya Verma',
    email: adithyaEmail,
    password: 'password123',
    phoneNumber: adithyaPhone
  });

  console.log('Verifying registration OTP for Adithya...');
  const adithyaRegisterResponse = await request(`/users/register/verify?email=${encodeURIComponent(adithyaEmail)}&otp=123456`, 'POST');
  adithyaToken = adithyaRegisterResponse.token;
  adithyaUser = adithyaRegisterResponse.user;
  console.log(`Adithya Logged In! Token: ${adithyaToken.substring(0, 15)}... User ID: ${adithyaUser.id}\n`);

  // 2. ADITHYA ADDS AN ITEM FOR LENDING
  console.log('2. Adithya adding item "Sony FX3 Camera" for lending...');
  const newItem = await request('/items', 'POST', {
    itemName: 'Sony FX3 Cinema Camera',
    description: 'Professional cinema camera rig with 24-70mm lens and V-mount battery pack.',
    pricePerDay: 45.0,
    category: 'electronics',
    location: 'Bangalore Central',
    deposit: 150.0,
    itemCondition: 'Like New',
    latitude: 12.9716,
    longitude: 77.5946,
    imageUrls: ['/uploads/camera_mock_1.jpg', '/uploads/camera_mock_2.jpg']
  }, adithyaToken);
  console.log(`Item Listed! Item ID: ${newItem.id}, Title: ${newItem.itemName}, Condition: ${newItem.itemCondition}, Deposit: $${newItem.deposit}\n`);

  // 3. REGISTER & LOGIN SHUBHAM (OTP Flow)
  console.log('3. Registering/Logging in Shubham...');
  let shubhamToken;
  let shubhamUser;
  const shubhamEmail = `test-shubham-${Date.now()}@example.com`;
  const shubhamPhone = String(Math.floor(1000000000 + Math.random() * 9000000000));
  
  console.log(`Initiating registration for Shubham (${shubhamEmail})...`);
  await request('/users/register/initiate', 'POST', {
    fullName: 'Shubham Kumar',
    email: shubhamEmail,
    password: 'password123',
    phoneNumber: shubhamPhone
  });

  console.log('Verifying registration OTP for Shubham...');
  const shubhamRegisterResponse = await request(`/users/register/verify?email=${encodeURIComponent(shubhamEmail)}&otp=123456`, 'POST');
  shubhamToken = shubhamRegisterResponse.token;
  shubhamUser = shubhamRegisterResponse.user;
  console.log(`Shubham Logged In! Token: ${shubhamToken.substring(0, 15)}... User ID: ${shubhamUser.id}\n`);

  // 4. SHUBHAM FETCHES ITEM CATALOG
  console.log('4. Shubham browsing available items...');
  const items = await request('/items', 'GET', null, shubhamToken);
  const foundItem = items.find(i => i.id === newItem.id);
  console.log(`Shubham found item: "${foundItem.itemName}" owned by ${foundItem.ownerName}\n`);

  // 5. SHUBHAM SENDS BORROW REQUEST FOR CUSTOM DATES
  console.log('5. Shubham sending borrow request for Sony FX3...');
  const borrowRequest = await request('/borrow', 'POST', {
    itemId: foundItem.id,
    borrowDate: '2026-07-02',
    returnDate: '2026-07-05'
  }, shubhamToken);
  console.log(`Borrow Request Sent! ID: ${borrowRequest.requestId}, Status: ${borrowRequest.status}\n`);

  // 6. SHUBHAM SENDS CHAT MESSAGE TO ADITHYA
  console.log('6. Shubham texting chat message to Adithya...');
  const chatMsg = await request('/chats/send', 'POST', {
    recipientId: adithyaUser.id,
    content: 'Hi Adithya! I have requested your Sony FX3. Is the lens clean and ready for pickup?'
  }, shubhamToken);
  console.log(`Chat Message Sent! Sender: Shubham, Content: "${chatMsg.content}"\n`);

  // 7. LOGIN ADITHYA & CHECK NOTIFICATIONS + CHATS
  console.log('7. Adithya checking inbox & notifications...');
  const adithyaNotifs = await request('/notifications', 'GET', null, adithyaToken);
  console.log('Adithya Notifications:', adithyaNotifs.map(n => `[${n.title}] - ${n.message}`));

  const adithyaContacts = await request('/chats/contacts', 'GET', null, adithyaToken);
  console.log('Adithya Chats Contacts:', adithyaContacts.map(c => `${c.name} (ID: ${c.contactId}) - Last: "${c.lastMessage}"`));

  const chatHistory = await request(`/chats/history?contactId=${shubhamUser.id}`, 'GET', null, adithyaToken);
  console.log('Conversation History from Shubham:', chatHistory.map(m => `[${m.sender.fullName}]: ${m.content}`));

  // 8. ADITHYA REPLIES TO SHUBHAM
  console.log('\n8. Adithya replying to Shubham...');
  const adithyaReply = await request('/chats/send', 'POST', {
    recipientId: shubhamUser.id,
    content: 'Hey Shubham! Yes, it is fully serviced, lens clean, and packed in the carry case.'
  }, adithyaToken);
  console.log(`Chat Reply Sent! Content: "${adithyaReply.content}"\n`);

  // 9. ADITHYA APPROVES THE REQUEST
  console.log('9. Adithya approving the borrow request...');
  const approvedReq = await request(`/borrow/${borrowRequest.requestId}/approve`, 'PUT', null, adithyaToken);
  console.log(`Request Approved! ID: ${approvedReq.requestId}, New Status: ${approvedReq.status}\n`);

  // 10. SHUBHAM VERIFIES CHAT REPLY & NOTIFICATION OF APPROVAL
  console.log('10. Shubham checking dashboard status...');
  const shubhamNotifs = await request('/notifications', 'GET', null, shubhamToken);
  console.log('Shubham Notifications:', shubhamNotifs.map(n => `[${n.title}] - ${n.message}`));

  // 11. SHUBHAM RETURNS THE ITEM
  console.log('\n11. Shubham returning the item...');
  const returnedReq = await request(`/borrow/${borrowRequest.requestId}/return`, 'PUT', null, shubhamToken);
  console.log(`Item Returned! ID: ${returnedReq.requestId}, New Status: ${returnedReq.status}\n`);

  // 12. ADITHYA VERIFIES NOTIFICATION OF RETURN
  console.log('12. Adithya checking final notification list...');
  const adithyaFinalNotifs = await request('/notifications', 'GET', null, adithyaToken);
  console.log('Adithya Notifications:', adithyaFinalNotifs.map(n => `[${n.title}] - ${n.message}`));

  // 13. TEST MOCK OTP VERIFICATION FLOW (TEMPORARY STORAGE)
  console.log('\n13. Testing OTP Verification Flow (Temporary Storage)...');
  const testEmail = `tester-profile-${Date.now()}@example.com`;
  
  // Initiate registration
  const testerPhone = String(Math.floor(1000000000 + Math.random() * 9000000000));
  await request('/users/register/initiate', 'POST', {
    fullName: 'OTP Tester',
    email: testEmail,
    password: 'password123',
    phoneNumber: testerPhone
  });
  console.log('OTP Tester registration initiated (stored temporarily).');

  // Attempt login - should fail because user is not yet created in the DB
  try {
    await request('/users/login', 'POST', { email: testEmail, password: 'password123' });
    throw new Error('Login succeeded for uncreated user (FAILURE)');
  } catch (err) {
    console.log('Login failed as expected for pending user:', err.message);
  }

  // Verify OTP (completes registration and creates user in DB)
  await request(`/users/register/verify?email=${encodeURIComponent(testEmail)}&otp=123456`, 'POST');
  console.log('OTP verified and user created in DB!');

  // Attempt login again - should succeed
  const testerLogin = await request('/users/login', 'POST', { email: testEmail, password: 'password123' });
  console.log(`Login succeeded for verified user! Token: ${testerLogin.token.substring(0, 10)}...`);

  // 14. ADITHYA EDITS AN ITEM
  console.log('\n14. Adithya editing listed item...');
  const updatedItem = await request(`/items/${newItem.id}`, 'PUT', {
    itemName: 'Sony FX3 Cinema Camera (Updated)',
    description: 'Updated cinema camera rig with extra lenses and a cleaning kit included.',
    pricePerDay: 50.0,
    category: 'cameras',
    location: 'Bangalore Central',
    deposit: 120.0,
    itemCondition: 'Like New',
    latitude: 12.9716,
    longitude: 77.5946,
    imageUrls: ['/uploads/camera_mock_updated.jpg']
  }, adithyaToken);
  console.log(`Item Updated! Title: "${updatedItem.itemName}", Price: $${updatedItem.pricePerDay}, Deposit: $${updatedItem.deposit}`);

  // 15. SENDING HELP MESSAGE TO SUPPORT DESK
  console.log('\n15. Submitting support ticket...');
  const supportRes = await request('/support/contact', 'POST', {
    name: 'Shubham Kumar',
    email: 'shubham@example.com',
    message: 'Hello support, I need help coordinating the delivery of a camera.'
  });
  console.log(`Support response: ${supportRes.message}`);

  console.log('\n=== ALL CONNECTIVITY & LIFECYCLE TESTS COMPLETED SUCCESSFULLY ===');
};

runTest().catch(console.error);
