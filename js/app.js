/**
 * app.js
 *
 * Entry point — wires up event listeners and coordinates the modules.
 * Deliberately kept thin: delegates validation, storage, and rendering
 * to their respective modules.
 */

import { validateForm } from './validation.js';
import { getSubmissions, addSubmission, removeSubmission } from './storage.js';
import { renderSubmissions } from './submission-list.js';

// Cache DOM references once on load
const form = document.getElementById('contact-form');
const errorSummary = document.getElementById('error-summary');
const errorSummaryList = document.getElementById('error-summary-list');
const submissionsList = document.getElementById('submissions-list');
const noSubmissions = document.getElementById('no-submissions');
const statusRegion = document.getElementById('submissions-status');

// Field config: maps field names to their DOM IDs for error handling.
// Centralised here so we don't repeat these strings everywhere.
const FIELD_CONFIG = {
  name: { inputId: 'input-name', errorId: 'error-name', fieldId: 'field-name' },
  email: { inputId: 'input-email', errorId: 'error-email', fieldId: 'field-email' },
  dob: { inputId: 'input-dob', errorId: 'error-dob', fieldId: 'field-dob' },
  phone: { inputId: 'input-phone', errorId: 'error-phone', fieldId: 'field-phone' },
};

/**
 * Initialise the app on page load.
 */
function init() {
  renderFooterDate();
  loadExistingSubmissions();

  form.addEventListener('submit', handleSubmit);
  submissionsList.addEventListener('click', handleRemove);
}

/**
 * Sets the footer date to today's date in a readable format.
 */
function renderFooterDate() {
  const dateEl = document.getElementById('footer-date');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
}

/**
 * Loads any existing submissions from storage on page load.
 */
function loadExistingSubmissions() {
  const submissions = getSubmissions();
  renderSubmissions(submissions, submissionsList, noSubmissions);
}

/**
 * Handles form submission.
 * Validates all fields, shows errors or saves the data.
 */
function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  // Read form values
  const data = {
    name: form.elements['name'].value,
    email: form.elements['email'].value,
    dob: form.elements['dob'].value,
    phone: form.elements['phone'].value,
  };

  const errors = validateForm(data);

  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  // Valid — save and update the UI
  const submission = addSubmission(data);
  renderSubmissions(getSubmissions(), submissionsList, noSubmissions);
  announceChange(`${submission.name} added to submissions`);
  form.reset();

  // Move focus to the new submission so the user sees it
  const newCard = submissionsList.querySelector(`[data-id="${submission.id}"]`);
  if (newCard) newCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Event delegation for remove buttons.
 * Listens on the list container rather than each button individually.
 */
function handleRemove(event) {
  const btn = event.target.closest('.btn--danger');
  if (!btn) return;

  const card = btn.closest('.submission-card');
  if (!card) return;

  const id = card.dataset.id;
  const name = card.querySelector('.submission-card__value')?.textContent || 'Submission';

  removeSubmission(id);
  renderSubmissions(getSubmissions(), submissionsList, noSubmissions);
  announceChange(`${name} removed from submissions`);

  const remaining = submissionsList.querySelectorAll('.submission-card');

  // Move focus to a logical destination — the firstitem in the list …
  if (remaining.length > 0) {
    remaining[0].querySelector('.btn--danger')?.focus();
  } else {
    // or the submissions heading
    document.getElementById('submissions-heading').setAttribute('tabindex', '-1');
    document.getElementById('submissions-heading').focus();
  }
}

/**
 * Displays validation errors in the summary and inline on each field.
 * Moves focus to the error summary so screen readers announce the problems.
 */
function showErrors(errors) {
  errorSummary.hidden = false;
  errorSummaryList.innerHTML = '';

  // Build the error summary links and mark up inline errors
  Object.entries(errors).forEach(([field, message]) => {
    const config = FIELD_CONFIG[field];
    if (!config) return;

    // Error summary: link that jumps to the relevant input
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${config.inputId}`;
    link.textContent = message;
    li.appendChild(link);
    errorSummaryList.appendChild(li);

    // Inline error on the field
    const errorSpan = document.getElementById(config.errorId);
    errorSpan.textContent = message;
    errorSpan.hidden = false;

    // Visual error state on the field wrapper
    document.getElementById(config.fieldId).classList.add('form-field--error');
    // ARIA invalid state on the input for screen readers
    document.getElementById(config.inputId).setAttribute('aria-invalid', 'true');
  });

  // Move focus to the summary so screen readers read out the errors
  errorSummary.focus();
}

/**
 * Clears all error states from the form.
 */
function clearErrors() {
  errorSummary.hidden = true;
  errorSummaryList.innerHTML = '';

  Object.values(FIELD_CONFIG).forEach(({ errorId, fieldId, inputId }) => {
    const errorSpan = document.getElementById(errorId);
    errorSpan.textContent = '';
    errorSpan.hidden = true;
    document.getElementById(fieldId).classList.remove('form-field--error');
    document.getElementById(inputId).removeAttribute('aria-invalid');
  });
}

/**
 * Announces a change to screen readers via the live region.
 * The message is set, then cleared after a short delay to allow re-announcement
 * if the same action happens again.
 */
function announceChange(message) {
  statusRegion.textContent = message;
  setTimeout(() => {
    statusRegion.textContent = '';
  }, 1000);
}

// Boot the app
init();
