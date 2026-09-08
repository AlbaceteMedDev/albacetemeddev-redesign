const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { selectedTopics, idsFromQuery, briefText, consultationURL } = require('../assets/js/services-explorer.js');
function topicData(page) {
  const html = fs.readFileSync(path.join(__dirname, '..', page), 'utf8');
  return JSON.parse(html.match(/<script id="service-topics" type="application\/json">([\s\S]*?)<\/script>/)[1]);
}
const topics = topicData('services/index.html');
test('Services and contact use the same six topic definitions', () => {
  assert.equal(topics.length, 6);
  assert.equal(new Set(topics.map(t => t.id)).size, 6);
  assert.deepEqual(topicData('contact/index.html'), topics);
});
test('URL selections accept only offered topics, without duplicates', () => {
  assert.deepEqual(idsFromQuery(topics, '?topics=claims-denials,unknown,claims-denials,__proto__,referral-strategy'), ['claims-denials', 'referral-strategy']);
  assert.deepEqual(idsFromQuery(topics, '?topics=%3Cscript%3Ealert(1)%3C%2Fscript%3E'), []);
});
test('Brief includes selected review areas and excludes unselected services', () => {
  const brief = briefText(topics, new Set(['claims-denials', 'practice-operations']));
  assert.match(brief, /Claims & denials/);
  assert.match(brief, /Service: Revenue cycle/);
  assert.match(brief, /Eligibility and prior authorization/);
  assert.match(brief, /Practice operations/);
  assert.match(brief, /Staff responsibilities and handoffs/);
  assert.doesNotMatch(brief, /Referral strategy|Product evaluation/);
  assert.match(brief, /Scope and next steps to be discussed/);
});
test('Contact handoff restores the same selected topics and brief', () => {
  const ids = ['service-development', 'coding-documentation', 'claims-denials'];
  const url = new URL(consultationURL(topics, ids), 'https://albacetemeddev.com');
  assert.equal(url.pathname, '/contact/');
  assert.equal(url.hash, '#message');
  const restored = idsFromQuery(topics, url.search);
  assert.deepEqual(selectedTopics(topics, restored), selectedTopics(topics, ids));
  assert.equal(briefText(topics, restored), briefText(topics, ids));
});
test('Empty and invalid selections produce no phantom brief', () => {
  assert.equal(briefText(topics, []), '');
  assert.equal(briefText(topics, ['not-a-service']), '');
  assert.equal(consultationURL(topics, []), '/contact/');
  assert.deepEqual(idsFromQuery(topics, '?preview=2'), []);
});
test('Removing a topic removes it from exported and carried content', () => {
  const selected = new Set(['claims-denials', 'practice-operations']);
  selected.delete('claims-denials');
  assert.doesNotMatch(briefText(topics, selected), /Claims & denials|Revenue cycle/);
  assert.equal(consultationURL(topics, selected), '/contact/?topics=practice-operations#message');
});
test('Selecting all six areas produces a bounded, deterministic handoff', () => {
  const ids = topics.map(t => t.id);
  const url = consultationURL(topics, ids);
  assert.ok(url.length < 250);
  assert.equal(idsFromQuery(topics, new URL(url, 'https://albacetemeddev.com').search).length, 6);
  assert.equal(briefText(topics, ids), briefText(topics, [...ids].reverse()));
});
