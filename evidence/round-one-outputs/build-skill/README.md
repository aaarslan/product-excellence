# Handoff queue fixture

Requires Node.js 18 or newer. Run `node server.mjs`; open http://127.0.0.1:4173. For concurrent isolated copies, use `PORT=4174 node server.mjs` and open the corresponding port. The default port is 4173. There are no dependencies, accounts, or external services. The server binds only to loopback and stores state in memory. Restart to reset the example.

`GET /api/handoffs` returns `{ items }`. Items have `id`, `title`, `account`, `priority`, and `status` (`ready` or `sent`).

`POST /api/handoffs/:id/send` submits one handoff and returns `{ item }`. Requests take about 600 ms. `h-102` fails its first submission with HTTP 503 and `{ error }`, then succeeds on retry. Other ready items succeed. Already sent items return their existing result without resending. Unknown IDs return 404. A GET while a submission is pending may still return its previous state. The service does not provide a batch endpoint.

The current frontend searches title and account, filters priority, and exports visible rows as CSV. The export includes title, account, priority, and status, with CSV escaping. This evaluated implementation connects selection and submission with recovery. The unmodified starting fixture, retained separately, had a disabled send button. No automatic retry policy is required; the user needs an explicit recovery path. A small bounded submission flow is sufficient for this local fixture.

This README was clarified during release packaging; implementation source and raw RESULT.md remain unchanged. For later independent browser verification, see ../../checks/browser/OBSERVATIONS.md.
