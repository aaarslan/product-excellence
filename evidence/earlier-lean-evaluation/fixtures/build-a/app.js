const form = document.getElementById('quote-form');
const quantity = document.getElementById('quantity');
const result = document.getElementById('quote-result');
const feedback = document.getElementById('quantity-error');
const submit = form.querySelector('button');
let revision = 0;
let active = null;

function invalidate() {
  revision += 1;
  if (active) {
    active.reject(new Error('Cancelled'));
    active.controller.abort();
    clearTimeout(active.timer);
    active = null;
  }
  result.textContent = '';
  result.setAttribute('aria-busy', 'false');
  submit.textContent = 'Get quote';
}

function validate() {
  const value = Number(quantity.value);
  const valid = quantity.value.trim() !== '' && Number.isSafeInteger(value) && value > 0;
  quantity.setAttribute('aria-invalid', String(!valid));
  feedback.textContent = valid ? '' : 'Enter a whole number of units greater than zero.';
  return valid;
}

quantity.addEventListener('input', () => {
  invalidate();
  validate();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  invalidate();
  if (!validate()) {
    quantity.focus();
    return;
  }
  const currentRevision = revision;
  const controller = new AbortController();
  const operation = {controller, timer: null, reject: null};
  const deadline = new Promise((resolve, reject) => {
    operation.reject = reject;
    operation.timer = setTimeout(() => {
      reject(new Error('Timeout'));
      controller.abort();
    }, 5000);
  });
  active = operation;
  result.textContent = 'Loading quote…';
  result.setAttribute('aria-busy', 'true');
  submit.textContent = 'Restart quote';
  try {
    const quote = await Promise.race([
      deadline,
      requestQuote(Number(quantity.value), {signal: controller.signal})
    ]);
    if (revision !== currentRevision) return;
    result.textContent = '$' + quote.total.toFixed(2);
    submit.textContent = 'Get quote';
  } catch (error) {
    if (revision !== currentRevision) return;
    result.textContent = error.message === 'Timeout'
      ? 'The quote took too long. Please retry.'
      : 'Could not load your quote. Please retry.';
    submit.textContent = 'Retry quote';
  } finally {
    clearTimeout(operation.timer);
    if (revision === currentRevision) {
      active = null;
      result.setAttribute('aria-busy', 'false');
    }
  }
});
