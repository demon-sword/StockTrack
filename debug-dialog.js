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
    windows.forEach(w => console.log('Window URL:', w.url()));
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
  
  await window.click('text=Vendors');
  await window.waitForTimeout(1000);
  
  await window.click('text=Add Vendor');
  await window.waitForTimeout(1000);
  
  // Debug: print dialog content
  const content = await window.content();
  console.log('\n--- Dialog HTML ---');
  // Find modal/dialog content
  const modalMatch = content.match(/<div[^>]*role="dialog"[^>]*>[\s\S]*?<\/div>/);
  if (modalMatch) {
    console.log(modalMatch[0].substring(0, 3000));
  } else {
    // Try finding any form
    const formMatch = content.match(/<form[\s\S]*?<\/form>/);
    if (formMatch) {
      console.log(formMatch[0].substring(0, 3000));
    } else {
      console.log('Last 5000 chars of page:');
      console.log(content.slice(-5000));
    }
  }
  
  await electronApp.close();
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});