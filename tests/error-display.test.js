const { showErrors, clearErrors } = require('../js/error-display.js');

let errorSummary;
let errorSummaryList;

const FIELD_CONFIG = {
  name: { inputId: 'input-name', errorId: 'error-name', fieldId: 'field-name' },
  email: { inputId: 'input-email', errorId: 'error-email', fieldId: 'field-email' },
};

beforeEach(() => {
  document.body.innerHTML = `
    <div id="error-summary" class="error-summary" role="alert" aria-labelledby="error-summary-heading" tabindex="-1">
        <h3 id="error-summary-heading">There is a problem</h3>
        <ul id="error-summary-list" class="error-summary__list"></ul>
    </div>
    <form id="contact-form" novalidate="" action="" method="post">
        <div class="form-field" id="field-name">
            <label class="form-field__label" for="input-name">Full name</label>
            <span class="form-field__error" id="error-name" hidden></span>
            <input class="form-field__input" id="input-name" name="name" type="text" autocomplete="name" aria-describedby="error-name" aria-invalid="true">
        </div>

        <div class="form-field" id="field-email">
            <label class="form-field__label" for="input-email">Email address</label>
            <span class="form-field__error" id="error-email" hidden></span>
            <input class="form-field__input" id="input-email" name="email" type="email" autocomplete="email" aria-describedby="error-email" aria-invalid="true">
        </div>

          <button type="submit" class="btn btn--primary">Submit</button>
     </form>
  `;
  errorSummary = document.getElementById('error-summary');
  errorSummaryList = document.getElementById('error-summary-list');
});

describe('showErrors', () => {
  test('shows error summary and list items', () => {
    const errors = {
      name: 'Enter your full name',
      email: 'Enter an email address',
    };

    showErrors(errors, errorSummary, errorSummaryList, FIELD_CONFIG);

    expect(errorSummary.hidden).toBe(false);
    expect(errorSummaryList.children).toHaveLength(2);
    expect(errorSummaryList.children[0].textContent).toBe('Enter your full name');
    expect(errorSummaryList.children[1].textContent).toBe('Enter an email address');
  });

  test('adds inline error messages and attributes', () => {
    const errors = { name: 'Enter your full name' };

    showErrors(errors, errorSummary, errorSummaryList, FIELD_CONFIG);

    const errorSpan = document.getElementById('error-name');
    expect(errorSpan.textContent).toBe('Enter your full name');
    expect(errorSpan.hidden).toBe(false);

    const fieldWrapper = document.getElementById('field-name');
    expect(fieldWrapper.classList.contains('form-field--error')).toBe(true);

    const input = document.getElementById('input-name');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  test('focuses error summary', () => {
    const errors = { name: 'Enter your full name' };

    showErrors(errors, errorSummary, errorSummaryList, FIELD_CONFIG);

    expect(document.activeElement).toBe(errorSummary);
  });

  test('ignores errors for unknown fields', () => {
    const errors = { unknownField: 'This should be ignored' };

    showErrors(errors, errorSummary, errorSummaryList, FIELD_CONFIG);

    expect(errorSummaryList.children).toHaveLength(0);
  });
});

describe('clearErrors', () => {
  test('hides error summary and clears list items', () => {
    // First show some errors to set up the state
    showErrors({ name: 'Error' }, errorSummary, errorSummaryList, FIELD_CONFIG);

    clearErrors(errorSummaryList, FIELD_CONFIG);

    expect(errorSummaryList.children).toHaveLength(0);
  });
});

describe('showErrors and clearErrors together', () => {
  test('toggles error states correctly', () => {
    const errors = { name: 'Enter your full name' };

    showErrors(errors, errorSummary, errorSummaryList, FIELD_CONFIG);
    expect(errorSummary.hidden).toBe(false);
    expect(errorSummaryList.children).toHaveLength(1);

    clearErrors(errorSummaryList, FIELD_CONFIG);
    expect(errorSummaryList.children).toHaveLength(0);
  });
});
