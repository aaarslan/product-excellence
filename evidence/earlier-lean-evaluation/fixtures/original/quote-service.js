globalThis.requestQuote = function requestQuote(quantity, options = {}) {
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) return reject(new DOMException('Cancelled', 'AbortError'));
    const timer = setTimeout(() => quantity === 13 ? reject(new Error('Service unavailable')) : resolve({total: quantity * 25, currency: 'USD'}), quantity === 1 ? 800 : 100);
    options.signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    }, {once: true});
  });
};
