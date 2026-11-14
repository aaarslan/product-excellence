const form = document.getElementById('quote-form');
const quantity = document.getElementById('quantity');
const result = document.getElementById('quote-result');
const error = document.getElementById('quantity-error');
const submit = document.getElementById('quote-submit');
let revision = 0;
let activeRequest;

function invalidateQuote() {
  revision += 1;
  if (activeRequest) {
    clearTimeout(activeRequest.timer);
    activeRequest.controller.abort();
    activeRequest = undefined;
  }
  result.textContent = '';
  result.setAttribute('aria-busy', 'false');
  submit.textContent = 'Get quote';
}

function validateQuantity() {
  const value = Number(quantity.value);
  const valid = quantity.value.trim() !== '' && Number.isSafeInteger(value) && value > 0;
  quantity.setAttribute('aria-invalid', String(!valid));
  error.textContent = valid ? '' : 'Enter a whole number of units greater than zero.';
  return valid;
}

quantity.addEventListener('input', () => {
  invalidateQuote();
  validateQuantity();
});

form.addEventListener('submit', event => {
  event.preventDefault();
  invalidateQuote();
  if (!validateQuantity()) {
    quantity.focus();
    return;
  }

  const requestRevision = revision;
  const controller = new AbortController();
  const units = Number(quantity.value);
  result.textContent = 'Calculating quote…';
  result.setAttribute('aria-busy', 'true');

  function finish(message, failed = false) {
    if (revision !== requestRevision) return;
    revision += 1;
    clearTimeout(activeRequest.timer);
    activeRequest = undefined;
    result.setAttribute('aria-busy', 'false');
    result.textContent = message;
    submit.textContent = failed ? 'Retry quote' : 'Get quote';
  }

  activeRequest = {
    controller,
    timer: setTimeout(() => {
      finish('The quote took too long. Please retry.', true);
      controller.abort();
    }, 5000)
  };

  Promise.resolve()
    .then(() => requestQuote(units, {signal: controller.signal}))
    .then(quote => finish('$' + quote.total.toFixed(2)))
    .catch(() => finish('We couldn’t get your quote. Please retry.', true));
});
