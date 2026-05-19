const { renderSubmissions } = require('../js/submission-list.js');

let listElement;
let emptyElement;

beforeEach(() => {
  document.body.innerHTML = `
    <p id="empty" hidden>No submissions yet.</p>
    <ul id="list" aria-label="Submitted contacts"></ul>
  `;
  listElement = document.getElementById('list');
  emptyElement = document.getElementById('empty');
});

const mockSubmission = (overrides = {}) => ({
  id: 'test-123',
  name: 'Jane Smith',
  email: 'jane@example.com',
  dob: '27/03/1990',
  phone: '07700900123',
  submittedAt: '2026-05-18T10:00:00.000Z',
  ...overrides,
});

describe('renderSubmissions', () => {
  test('shows empty message when no submissions', () => {
    renderSubmissions([], listElement, emptyElement);

    expect(emptyElement.hidden).toBe(false);
    expect(listElement.hidden).toBe(true);
    expect(listElement.children).toHaveLength(0);
  });

  test('hides empty message when submissions exist', () => {
    renderSubmissions([mockSubmission()], listElement, emptyElement);

    expect(emptyElement.hidden).toBe(true);
    expect(listElement.hidden).toBe(false);
  });

  test('renders correct number of cards', () => {
    const submissions = [
      mockSubmission({ id: '1', name: 'Alice' }),
      mockSubmission({ id: '2', name: 'Bob' }),
    ];
    renderSubmissions(submissions, listElement, emptyElement);

    expect(listElement.children).toHaveLength(2);
  });

  test('card contains submission data as text content', () => {
    renderSubmissions([mockSubmission()], listElement, emptyElement);

    const card = listElement.firstChild;
    expect(card.textContent).toContain('Jane Smith');
    expect(card.textContent).toContain('jane@example.com');
    expect(card.textContent).toContain('27/03/1990');
    expect(card.textContent).toContain('07700900123');
  });

  test('card has a data-id attribute', () => {
    renderSubmissions([mockSubmission()], listElement, emptyElement);

    expect(listElement.firstChild.dataset.id).toBe('test-123');
  });

  test('remove button has accessible label with name', () => {
    renderSubmissions([mockSubmission()], listElement, emptyElement);

    const btn = listElement.querySelector('button');
    expect(btn.getAttribute('aria-label')).toBe('Remove Jane Smith');
  });

  test('re-render replaces previous content', () => {
    renderSubmissions([mockSubmission({ id: '1' })], listElement, emptyElement);
    renderSubmissions([mockSubmission({ id: '2' })], listElement, emptyElement);

    expect(listElement.children).toHaveLength(1);
    expect(listElement.firstChild.dataset.id).toBe('2');
  });
});
