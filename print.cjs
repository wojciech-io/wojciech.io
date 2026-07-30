#!/usr/bin/env node
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const cwd = process.cwd();
  const docPath = `file://${path.join(cwd, 'doc.html')}`;

  console.log('📄 Loading document...');
  await page.goto(docPath, { waitUntil: 'networkidle' });

  console.log('📋 Reading header and footer templates...');
  const headerTemplate = fs.readFileSync(path.join(cwd, 'header.html'), 'utf8');
  const footerTemplate = fs.readFileSync(path.join(cwd, 'footer.html'), 'utf8');

  console.log('🖨️  Rendering PDF with branded header/footer...');
  const pdfPath = path.join(cwd, 'LSI_GetResponse_Partnership.pdf');
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '26mm', right: '14mm', bottom: '24mm', left: '14mm' },
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    displayHeaderFooter: true,
    printBackground: true,
  });

  console.log('✅ PDF created:', pdfPath);
  console.log('📊 File size:', (fs.statSync(pdfPath).size / 1024).toFixed(2), 'KB');

  await browser.close();

  console.log('\n✨ Ready to send to w.luszczynski@gmail.com');
})().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
