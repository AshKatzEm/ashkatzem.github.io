const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'conjugator.html'), 'utf8');
const start = html.indexOf('const persons');
const end = html.indexOf('function update()');
const code = html.slice(start, end);
fs.writeFileSync('/tmp/gen_tests.js', `global.path={};\n${code}\nmodule.exports={generateForm};`);
const { generateForm } = require('/tmp/gen_tests.js');

const tests = JSON.parse(fs.readFileSync(path.join(__dirname, 'tests.json'), 'utf8'));
let passed = 0, failed = 0;
for (const t of tests) {
  global.path.group = t.group;
  global.path.binyan = t.binyan;
  global.path.tense = t.tense;
  const out = generateForm(t.root, t.person);
  const ok = out.normalize('NFC') === t.expected.normalize('NFC');
  if (ok) passed++; else failed++;
  console.log(`${ok ? 'OK ' : 'FAIL'} ${t.root} ${t.group}/${t.binyan}/${t.tense}/${t.person} -> ${out} ${ok ? '' : ' (expected ' + t.expected + ')'}`);
}
console.log(`\nPassed: ${passed}, Failed: ${failed}`);
