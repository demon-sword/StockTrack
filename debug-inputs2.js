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
  
  // Debug: get all input elements with their parent
  const inputs = await window.$$('input');
  console.log(`Found ${inputs.length} input elements`);
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const placeholder = await inputs[i].getAttribute('placeholder');
    const outerHTML = await inputs[i].evaluate(el => el.outerHTML);
    console.log(`  Input ${i}: type=${type}, placeholder=${placeholder}`);
    console.log(`    HTML: ${outerHTML.substring(0, 200)}`);
  }
  
  // Also check form structure
  const form = await window.$('form');
  if (form) {
    const formInputs = await form.$$('input');
    console.log(`\nForm has ${formInputs.length} inputs`);
    for (let i = 0; i < formInputs.length; i++) {
      const type = await formInputs[i].getAttribute('type');
      const outerHTML = await formInputs[i].evaluate(el => el.outerHTML);
      console.log(`  Form Input ${i}: type=${type}`);
      console.log(`    HTML: ${outerHTML.substring(0, 200)}`);
    }
  }
  
  await electronApp.close();
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});