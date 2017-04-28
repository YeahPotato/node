'use strict';
require('../common');
const assert = require('assert');
const inspect = require('util').inspect;
const checkIsHttpToken = require('_http_common')._checkIsHttpToken;
const checkInvalidHeaderChar = require('_http_common')._checkInvalidHeaderChar;

// Good header field names
[
  'TCN',
  'ETag',
  'date',
  'alt-svc',
  'Content-Type',
  '0',
  'Set-Cookie2',
  'Set_Cookie',
  'foo`bar^',
  'foo|bar',
  '~foobar',
  'FooBar!',
  '#Foo',
  '$et-Cookie',
  '%%Test%%',
  'Test&123',
  'It\'s_fun',
  '2*3',
  '4+2',
  '3.14159265359'
].forEach(function(str) {
  assert.strictEqual(
    checkIsHttpToken(str), true,
    `checkIsHttpToken(${inspect(str)}) unexpectedly failed`);
});
// Bad header field names
[
  ':',
  '@@',
  '中文呢', // unicode
  '((((())))',
  ':alternate-protocol',
  'alternate-protocol:',
  'foo\nbar',
  'foo\rbar',
  'foo\r\nbar',
  'foo\x00bar',
  '\x7FMe!',
  '{Start',
  '(Start',
  '[Start',
  'End}',
  'End)',
  'End]',
  '"Quote"',
  'This,That'
].forEach(function(str) {
  assert.strictEqual(
    checkIsHttpToken(str), false,
    `checkIsHttpToken(${inspect(str)}) unexpectedly succeeded`);
});


// Good header field values
[
  'foo bar',
  'foo\tbar',
  '0123456789ABCdef',
  '!@#$%^&*()-_=+\\;\':"[]{}<>,./?|~`'
].forEach(function(str) {
  assert.strictEqual(
    checkInvalidHeaderChar(str), false,
    `checkInvalidHeaderChar(${inspect(str)}) unexpectedly failed`);
});

// Bad header field values
[
  'foo\rbar',
  'foo\nbar',
  'foo\r\nbar',
  '中文呢', // unicode
  '\x7FMe!',
  'Testing 123\x00',
  'foo\vbar',
  'Ding!\x07'
].forEach(function(str) {
  assert.strictEqual(
    checkInvalidHeaderChar(str), true,
    `checkInvalidHeaderChar(${inspect(str)}) unexpectedly succeeded`);
});
