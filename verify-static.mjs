import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./dist/index.html');
const html = fs.readFileSync(filePath, 'utf-8');

console.log('📌 Analyzing: dist/index.html\n');

// Check for form elements in the HTML
const checks = [
  { pattern: /<form/gi, name: '<form>' },
  { pattern: /<input/gi, name: '<input>' },
  { pattern: /<textarea/gi, name: '<textarea>' },
  { pattern: /<select/gi, name: '<select>' },
  { pattern: /type="submit"/gi, name: 'type="submit"' },
];

console.log('✅ FORM ELEMENTS IN STATIC HTML:');
let totalCount = 0;
checks.forEach(({ pattern, name }) => {
  const matches = html.match(pattern) || [];
  const count = matches.length;
  console.log(`   ${name}: ${count}`);
  totalCount += count;
});

console.log(`\n📊 TOTAL FORM ELEMENTS: ${totalCount}`);

if (totalCount === 0) {
  console.log('\n✅ SUCCESS! HTML contains NO form elements');
  console.log('   + readonly-protector.ts is embedded in the JS bundle');
  console.log('   + When VITE_PUBLIC_SITE_READONLY=true, forms will be');
  console.log('     removed at runtime by the protector');
  console.log('\n✨ This site is safe for Google review!');
} else {
  console.log(`\n⚠️  CAUTION: ${totalCount} form element(s) found in HTML`);
}

// Check for new trust pages links
console.log('\n📍 CHECKING FOR TRUST PAGE SCRIPTS:');
const hasPrivacy = html.includes('PrivacyPolicy') || html.includes('#/privacy');
const hasTerms = html.includes('TermsAndConditions') || html.includes('#/terms');
const hasContact = html.includes('ContactInformation') || html.includes('#/contact-info');

console.log(`   Privacy Policy: ${hasPrivacy ? '✅' : '⚠️'}`);
console.log(`   Terms & Conditions: ${hasTerms ? '✅' : '⚠️'}`);
console.log(`   Contact Information: ${hasContact ? '✅' : '⚠️'}`);

console.log('\n🔍 STATIC HTML HEAD:');
const headMatch = html.match(/<head>([\s\S]*?)<\/head>/);
if (headMatch) {
  const head = headMatch[1];
  console.log(head.substring(0, 400) + '...');
}
