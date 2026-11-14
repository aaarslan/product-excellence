# Quote preview implementation

Implemented in `fixtures/build-a/app.js` and `index.html`; regression checks are in `app.test.cjs`.

- Loading and retryable failure/timeout states, with a five-second request deadline.
- Every edit clears the displayed quote and cancels active work. Revision checks prevent stale results even when cancellation is ignored.
- Empty, nonpositive, fractional, and unsafe-integer quantities receive associated accessible feedback; invalid submission focuses the input.
- Preserved native form submission, keyboard controls, visible focus, and fluid input sizing. Quote service and arithmetic are unchanged.

Validation: `node --check app.js` and `node app.test.cjs` passed. Tests cover validation, loading, edit invalidation, out-of-order responses with ignored cancellation, service error/retry, timeout/late completion, repeated submission, timer cleanup, and the actual local service's arithmetic and failure path.

Tests use a simulated DOM and deterministic timers. No real-browser, assistive-technology, or rendered responsive-layout verification was performed. No dependencies, comments/docstrings, CI, external calls, or deployment were added.
