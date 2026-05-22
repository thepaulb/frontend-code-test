/**
 * submission-list.js
 *
 * Handles rendering the submissions list in the DOM.
 * Separated from app.js to keep DOM rendering logic isolated.
 */

/**
 * Renders the full submissions list from an array of submission objects.
 * Replaces all existing content in the list element.
 */
export function renderSubmissions(submissions, listElement, emptyElement) {
  // Toggle empty state message
  const hasItems = submissions.length > 0;
  emptyElement.hidden = hasItems;
  listElement.hidden = !hasItems;

  // Clear and re-render. For a list this size, full re-render is fine —
  // we'd only optimise with targeted updates if we had hundreds of items.
  listElement.replaceChildren();

  submissions.forEach((submission) => {
    const li = createSubmissionCard(submission);
    listElement.appendChild(li);
  });
}

/**
 * Creates a single submission card as an <li> element.
 * Uses textContent rather than innerHTML to avoid XSS with user data.
 */
function createSubmissionCard(submission) {
  const li = document.createElement('li');
  li.classList.add('submission-card');
  li.dataset.id = submission.id;

  // Details grid
  const details = document.createElement('div');
  details.classList.add('submission-card__details');

  const fields = [
    { label: 'Name', value: submission.name },
    { label: 'Email', value: submission.email },
    { label: 'DOB', value: submission.dob },
    { label: 'Phone', value: submission.phone },
  ];

  fields.forEach(({ label, value }) => {
    const field = document.createElement('div');

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('submission-card__label');
    labelSpan.textContent = `${label}: `;

    const valueSpan = document.createElement('span');
    valueSpan.classList.add('submission-card__value');
    valueSpan.textContent = value;

    field.appendChild(labelSpan);
    field.appendChild(valueSpan);
    details.appendChild(field);
  });

  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.classList.add('btn', 'btn--danger');
  removeBtn.textContent = 'Remove';
  // Accessible label so screen readers say "Remove Jane Smith" not just "Remove"
  removeBtn.setAttribute('aria-label', `Remove ${submission.name}`);

  li.appendChild(details);
  li.appendChild(removeBtn);

  return li;
}
