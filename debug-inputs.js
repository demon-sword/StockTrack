const { _electron: electron } = require('playwright');
const path = require('path');

(async () => {
  const electronApp = await electron.launch({
    args: [path.join(__dirname, 'main.js')]
  });
  
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
  
  await window.waitForLoadState('domcontentloaded');
  await window.click('text=Vendors');
  await window.waitForTimeout(1000);
  await window.click('text=Add Vendor');
  await window.waitForTimeout(1000);
  
  // Debug: get all input elements
  const inputs = await window.$$('input');
  console.log(`Found ${inputs.length} input elements`);
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const placeholder = await inputs[i].getAttribute('placeholder');
    console.log(`  Input ${i}: type=${type}, placeholder=${placeholder}`);
  }
  
  const textareas = await window.$$('textarea');
  console.log(`Found ${textareas.length} textarea elements`);
  
  await electronApp.close();
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});