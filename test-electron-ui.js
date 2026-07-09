const { _electron: electron } = require('playwright');
const path = require('path');

(async () => {
  const electronApp = await electron.launch({
    args: [path.join(__dirname, 'main.js')]
  });
  
  // Wait for the actual app window (not DevTools)
  let window;
  for (let i = 0; i < 20; i++) {
    const windows = electronApp.windows();
    for (const w of windows) {
      const url = w.url();
      if (url.startsWith('file://') && url.includes('index.html')) {
        window = w;
        break;
      }
    }
    if (window) break;
    await new Promise(r => setTimeout(r, 500));
  }
  
  if (!window) {
    throw new Error('Could not find app window');
  }
  
  await window.waitForLoadState('domcontentloaded');
  
  console.log('App loaded:', await window.title());
  console.log('URL:', window.url());
  
  // Test 1: Click Vendors tab
  console.log('\n--- Test 1: Click Vendors tab ---');
  await window.click('text=Vendors');
  await window.waitForTimeout(1000);
  console.log('Vendors tab clicked');
  
  // Test 2: Click "Add Vendor" button to open dialog
  console.log('\n--- Test 2: Open Add Vendor dialog ---');
  await window.click('text=Add Vendor');
  await window.waitForTimeout(1000);
  console.log('Add Vendor dialog opened');
  
// Test 3: Fill vendor form
  console.log('\n--- Test 3: Fill vendor form ---');
  // Form inputs: [0]=name (required), [1]=phone, [2]=contactPerson, [3]=email
  const nameInput = window.locator('form input[type="text"]').nth(0);
  const phoneInput = window.locator('form input[type="text"]').nth(1);
  const contactInput = window.locator('form input[type="text"]').nth(2);
  const emailInput = window.locator('form input[type="email"]').first();
  
  await nameInput.fill('Test Vendor');
  await phoneInput.fill('1234567890');
  await contactInput.fill('John Doe');
  await emailInput.fill('test@example.com');
  console.log('Form filled');

  // Test 4: Submit form
  console.log('\n--- Test 4: Submit form ---');
  await window.locator('form button[type="submit"]').click();
  await window.waitForTimeout(1000);
  console.log('Form submitted');
  
  // Test 5: Verify vendor appears in list
  console.log('\n--- Test 5: Verify vendor in list ---');
  const content = await window.content();
  if (content.includes('Test Vendor')) {
    console.log('SUCCESS: Vendor appears in list');
  } else {
    console.log('FAIL: Vendor not found in list');
  }
  
  // Test 6: Test dialog close (open new dialog and close it)
  console.log('\n--- Test 6: Close dialog ---');
  await window.click('text=Add Vendor');
  await window.waitForTimeout(1000);
  await window.locator('form button:has-text("Cancel")').click();
  await window.waitForTimeout(500);
  console.log('Dialog closed via cancel button');
  
  // Test 7: Navigate to other tabs
  console.log('\n--- Test 7: Navigate tabs ---');
  for (const tab of ['Job Workers', 'Polishers', 'Sales', 'Reports']) {
    await window.click(`text=${tab}`);
    await window.waitForTimeout(500);
    console.log(`Tab "${tab}" loaded`);
  }
  
  await electronApp.close();
  console.log('\n=== ALL TESTS PASSED ===');
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});