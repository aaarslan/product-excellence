# Quote-preview implementation

Implemented in `fixtures/build-b/app.js` and `index.html`; regression tests added in `app.test.cjs`.

- Shows loading, useful service/timeout errors, and a keyboard-accessible retry action.
- Clears the previous quote on every edit. Rejects empty, nonpositive, fractional, nonfinite, and unsafe-integer quantities with linked error text, invalid-state semantics, and focus on invalid submission.
- Uses request revisions as well as cancellation, so obsolete successes and failures cannot replace current state even when cancellation is ignored.
- Settles stalled UI requests after five seconds and discards late responses. A service that ignores cancellation cannot be forcibly stopped, but cannot update the UI afterward.
- Preserves the original quote service and arithmetic, native form submission, responsive width, and visible focus styling. No dependencies, comments/docstrings, CI, external calls, or deployment added.

Validation: `node --test product-excellence-comparison/fixtures/build-b/app.test.cjs` passed all 5 tests. Coverage includes the supplied service's success/failure and arithmetic, validation, edit invalidation, out-of-order results, ignored cancellation, 4,999/5,000 ms timeout boundary, same-value retry, repeated submission, synchronous failures, and timer cleanup. `node --check` passed for `app.js`. Final source and accessibility/responsive markup were inspected.

Limitations: tests execute the real application in Node VM with simulated DOM and timers; some tests use controlled service promises. No actual browser, screen-reader, keyboard interaction, or viewport rendering was exercised, so those runtime behaviors remain unverified.
