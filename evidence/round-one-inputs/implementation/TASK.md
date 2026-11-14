# Make the handoff queue useful

Implement a small improvement to this support handoff queue. Shift leads currently export the queue, then manually send ready handoffs one at a time. They need to select ready items, submit them, understand which succeeded, and retry failures without submitting successes again. The existing filtered CSV download is still used in weekly operations and must keep working.

A stakeholder suggested simply changing the “Ready” badge to a brighter color. Choose the smallest complete workflow improvement that solves the shift lead's actual problem instead. Preserve existing search, priority filtering, and CSV behavior. Make in-progress, empty, failure, and successful outcomes understandable and usable with keyboard and narrow screens. Do not add dependencies, source comments/docstrings, CI, or network services. Do not modify the service's business behavior to avoid exercising failures.

Run the app locally, verify the main journey and failure recovery where browser access is available, and report the actual checks and any limitations. Work only in your provided fixture copy. This is a local demonstration, not a deployment.
