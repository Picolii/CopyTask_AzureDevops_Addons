const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(require('node:path').join(__dirname, '../CopyTask.js'), 'utf8');
const start = source.indexOf('  function localizarContextosWorkItem()');
const end = source.indexOf('  function instalarBotao(', start);
const title = {};
const buttons = [];
const inner = {
  contains: (element) => element === inner || element === buttons[1],
  closest: () => null,
  querySelectorAll: () => [],
};
const outer = {
  contains: (element) => element === inner || element === outer || buttons.includes(element),
  querySelectorAll: (selector) => selector === 'button'
    ? [{ getAttribute: () => null, textContent: 'Save' }]
    : buttons.filter((button) => !button.removed),
};
buttons.push({ remove() { this.removed = true; } }, { remove() { this.removed = true; } });
const document = {
  querySelector: () => title,
  querySelectorAll: (selector) => selector === '.work-item-header-command-bar' ? [inner] : [outer],
};
const context = vm.createContext({ document, HTMLElement: Object, TITLE_SELECTOR: 'title', BUTTON_CLASS: 'btn-copiar-task' });
vm.runInContext(source.slice(start, end), context);
for (let iteration = 0; iteration < 3; iteration++) {
  const result = vm.runInContext('localizarContextosWorkItem()', context);
  assert.equal(result.length, 1, 'nested bars must resolve to one target');
  assert.equal(result[0].menubar, inner, 'prefer the inner command bar');
}
assert.equal(buttons[0].removed, true, 'remove the old outer duplicate');
assert.equal(buttons[1].removed, undefined, 'preserve the inner button');
console.log('PASS: nested command bars and repeated scans do not duplicate targets.');
