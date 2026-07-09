const { _electron: electron } = require('playwright');
const path = require('path');

(async () => {
  const electronApp = await electron.launch({
    args: [path.join(__dirname, 'main.js')]
  });
  
  const window = await electronApp.firstWindow();
  await window.waitForLoadState('domcontentloaded');
  
  console.log('Title:', await window.title());
  console.log('URL:', window.url());
  
  const content = await window.content();
  console.log('Content preview:', content.substring(0, 500));
  
  await electronApp.close();
  console.log('SUCCESS');
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
