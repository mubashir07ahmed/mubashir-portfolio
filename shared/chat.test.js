import test from 'node:test';
import assert from 'node:assert/strict';
import { getLocalAnswer, isProfileQuestion, isRestrictedGeneralQuestion } from './chat.js';

test('outside-profile questions stay restricted while simple questions work', () => {
  const questions = [
    'What is machine learning?',
    'Can you explain binary search?',
  ];

  for (const question of questions) {
    assert.equal(isProfileQuestion(question), false, question);
  }

  assert.match(getLocalAnswer('Explain quantum computing in detail').text, /focused on Mubashir’s profile/i);
  assert.equal(getLocalAnswer('What is 2 + 2?').text, 'The answer is 4.');
  assert.match(getLocalAnswer('What is AI?').text, /field of building systems/i);
  assert.match(getLocalAnswer('hiiii').text, /Hi there/i);
  assert.match(getLocalAnswer('How are you?').text, /ready to help/i);
  assert.match(getLocalAnswer('What is a website?').text, /collection of pages/i);
  assert.match(getLocalAnswer('What are you?').text, /AI Chatbot on Mubashir Ahmed’s portfolio/i);
  assert.match(getLocalAnswer('What can you do?').text, /help visitors, recruiters, and companies/i);
  assert.equal(isProfileQuestion('What are you?'), true);
  assert.equal(isProfileQuestion('Can I view his resume?'), true);
  assert.equal(isRestrictedGeneralQuestion('Can you explain recursion?'), true);
  assert.equal(isRestrictedGeneralQuestion('What is the capital of France?'), true);
  assert.equal(isRestrictedGeneralQuestion('I had a difficult day at work.'), false);
});

test('explicit Mubashir questions remain profile-grounded', () => {
  assert.equal(isProfileQuestion('What technologies does Mubashir know?'), true);
  assert.equal(isProfileQuestion('Can I view Mubashir’s resume?'), true);
  assert.match(getLocalAnswer('What technologies does Mubashir know?').text, /C, Java, Python/);
  assert.match(getLocalAnswer('What achievements has Mubashir earned?').text, /Prompt Craft/);
  assert.match(getLocalAnswer('Who is he?').text, /Mubashir Ahmed is/i);
  assert.deepEqual(getLocalAnswer('Can I view Mubashir’s resume?').actions.map(({ label }) => label), ['Scroll to resume', 'View PDF', 'Download PDF']);
  assert.equal(
    getLocalAnswer('How old is Mubashir?').text,
    'That information has not been added to Mubashir’s portfolio yet.',
  );
});

test('the chatbot can explain detailed page content', () => {
  assert.match(getLocalAnswer('Tell me about the Local AI Question Solver project').text, /extracts questions from webpages/i);
  assert.match(getLocalAnswer('What is in the programming languages skill group?').text, /C, Java, Python, JavaScript/);
  assert.match(getLocalAnswer('What is Mubashir learning journey?').text, /Building AI-powered applications/i);
  assert.match(getLocalAnswer('What coding interests are shown?').text, /Artificial Intelligence.*Machine Learning/i);
  assert.match(getLocalAnswer('What sections are on this website?').text, /Home, About, Skills, Projects/i);
  assert.match(getLocalAnswer('Where is Mubashir based?').text, /Hyderabad, Telangana, India/i);
});
