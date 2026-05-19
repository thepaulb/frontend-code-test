const {
  getSubmissions,
  addSubmission,
  removeSubmission,
} = require('../js/storage.js');

// Mock localStorage — jsdom provides it but we want to verify our calls
beforeEach(() => {
  localStorage.clear();
});

describe('getSubmissions', () => {
  test('returns empty array when nothing stored', () => {
    expect(getSubmissions()).toEqual([]);
  });

  test('returns parsed submissions from storage', () => {
    const data = [{ id: '1', name: 'Test' }];
    localStorage.setItem('submissions', JSON.stringify(data));
    expect(getSubmissions()).toEqual(data);
  });

  test('returns empty array for corrupt JSON', () => {
    localStorage.setItem('submissions', '{bad json');
    expect(getSubmissions()).toEqual([]);
  });

  test('returns empty array if stored value is not an array', () => {
    localStorage.setItem('submissions', JSON.stringify({ not: 'an array' }));
    expect(getSubmissions()).toEqual([]);
  });
});

describe('addSubmission', () => {
  test('stores a submission with an id and timestamp', () => {
    const result = addSubmission({ name: 'Jane Smith', email: 'j@e.com' });

    expect(result.id).toBeDefined();
    expect(result.submittedAt).toBeDefined();
    expect(result.name).toBe('Jane Smith');
  });

  test('prepends new submissions (newest first)', () => {
    addSubmission({ name: 'First' });
    addSubmission({ name: 'Second' });

    const stored = getSubmissions();
    expect(stored[0].name).toBe('Second');
    expect(stored[1].name).toBe('First');
  });
});

describe('removeSubmission', () => {
  test('removes a submission by ID and returns true', () => {
    const submission = addSubmission({ name: 'To Remove' });
    const result = removeSubmission(submission.id);

    expect(result).toBe(true);
    expect(getSubmissions()).toHaveLength(0);
  });

  test('returns false if ID not found', () => {
    addSubmission({ name: 'Keep' });
    expect(removeSubmission('nonexistent-id')).toBe(false);
  });

  test('only removes the targeted submission', () => {
    addSubmission({ name: 'Keep Me' });
    const toRemove = addSubmission({ name: 'Remove Me' });
    addSubmission({ name: 'Also Keep' });

    removeSubmission(toRemove.id);
    const remaining = getSubmissions();

    expect(remaining).toHaveLength(2);
    expect(remaining.find((s) => s.name === 'Remove Me')).toBeUndefined();
  });
});
