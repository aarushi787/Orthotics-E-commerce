import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  console.log('📌 Opening: http://localhost:5173/');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Check for form elements
  const formCount = await page.locator('form').count();
  const inputCount = await page.locator('input').count();
  const textareaCount = await page.locator('textarea').count();
  const selectCount = await page.locator('select').count();
  const submitCount = await page.locator('button[type="submit"]').count();

  console.log('\n✅ FORM ELEMENTS COUNT:');
  console.log(`   <form>: ${formCount}`);
  console.log(`   <input>: ${inputCount}`);
  console.log(`   <textarea>: ${textareaCount}`);
  console.log(`   <select>: ${selectCount}`);
  console.log(`   <button[type="submit"]>: ${submitCount}`);

  const totalForms = formCount + inputCount + textareaCount + selectCount + submitCount;
  console.log(`\n📊 TOTAL FORM ELEMENTS: ${totalForms}`);

  if (totalForms === 0) {
    console.log('\n✅ SUCCESS! Homepage is completely read-only (no forms detected)');
    console.log('   This site is now safe to submit to Google for review.');
  } else {
    console.log(`\n⚠️  CAUTION: ${totalForms} form element(s) still detected on homepage`);
    console.log('   Google may still flag the site. Review and disable these elements.');
  }

  // Check footer links
  console.log('\n📍 CHECKING FOOTER LINKS:');
  const privacyLink = await page.locator('a[href="#/privacy"]').count();
  const termsLink = await page.locator('a[href="#/terms"]').count();
  const contactLink = await page.locator('a[href="#/contact-info"]').count();

  console.log(`   Privacy Policy link: ${privacyLink > 0 ? '✅' : '❌'}`);
  console.log(`   Terms link: ${termsLink > 0 ? '✅' : '❌'}`);
  console.log(`   Contact link: ${contactLink > 0 ? '✅' : '❌'}`);

  // Check HTTPS
  const url = page.url();
  console.log(`\n🔒 SITE URL: ${url}`);
  console.log(`   HTTPS: ${url.startsWith('https://') ? '✅' : '⚠️ Local/HTTP'}`);

  await browser.close();
  console.log('\n✨ Verification complete!');
})();
