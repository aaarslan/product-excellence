const form = document.getElementById('quote-form');
const quantity = document.getElementById('quantity');
const result = document.getElementById('quote-result');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const quote = await requestQuote(Number(quantity.value));
  result.textContent = '$' + quote.total.toFixed(2);
});
