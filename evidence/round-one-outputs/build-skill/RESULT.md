# Handoff queue improvement

Implemented a complete selection-to-send workflow rather than recoloring a badge.

- Select individual ready handoffs or all visible ready handoffs. Sent rows cannot be selected.
- Send sequentially with progress and duplicate-click protection. Filters and selections are locked during submission.
- Successful handoffs become sent and leave the selection. Failed handoffs retain their error and selection for an explicit retry that excludes successes.
- Requests have a ten-second timeout; uncertain delivery gets safe-retry guidance, using the service's existing idempotent behavior.
- Filtering clears selection with an explanation, preventing accidental submission of hidden items. Search, priority filtering, and filtered CSV remain available.
- Native labeled checkboxes, focus restoration, live status, wrapping narrow-screen styling, empty-state guidance, and reload recovery are included.

## Verification

`node --check app.js` passed.

`workflow.test.mjs` passed against the unchanged real local service with a lightweight simulated DOM. It verifies batch progress, the service's real first-attempt 503, partial success, failed-only retry, no repeated successful IDs, duplicate-click guard, search/priority filtering, filtered CSV content, empty results, focus restoration, simulated offline failure/recovery, and queue-load recovery.

Run from this directory in one shell invocation against a fresh service:

```sh
PORT=4175 node server.mjs & fixture_pid=$!; trap 'kill "$fixture_pid" 2>/dev/null || true' EXIT; sleep 0.2; node workflow.test.mjs
```

`server.mjs` remains byte-identical: SHA-256 `30426c92b47cec7040657297e65286b2c2cc96a70afe0edfc19c0fbdfcdb3cff`.

## Limitations

The browser returned `ERR_CONNECTION_REFUSED` for the local server, including the supported escalated launch. Browser interaction, actual keyboard navigation, responsive rendering, downloaded-file UI, and screen-reader behavior were not verified by this worker. The simulated DOM tests do not establish visual or end-to-end browser quality. The parent coordinator is handling independent browser validation. No deployment, installation, external network service, or CI changes were made.
