/**
 * error-display.js
 *
 * Handles error rendering in the DOM.
 * Separated from app.js to keep DOM rendering logic isolated.
 */

/**
 * Displays validation errors in the summary and inline on each field.
 * Moves focus to the error summary so screen readers announce the problems.
 */
export function showErrors(errors, errorSummary, errorSummaryList, FIELD_CONFIG) {
  errorSummary.hidden = false;
  errorSummaryList.replaceChildren();

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

  // Move focus to the summary so the user hears the errors
  // and can Tab through the links to each invalid field
  errorSummary.focus();
}

/**
 * Clears all error states from the form.
 */
export function clearErrors(errorSummaryList, FIELD_CONFIG) {
  errorSummaryList.innerHTML = '';

  Object.values(FIELD_CONFIG).forEach(({ errorId, fieldId, inputId }) => {
    const errorSpan = document.getElementById(errorId);
    errorSpan.textContent = '';
    errorSpan.hidden = true;
    document.getElementById(fieldId).classList.remove('form-field--error');
    document.getElementById(inputId).removeAttribute('aria-invalid');
  });
}
