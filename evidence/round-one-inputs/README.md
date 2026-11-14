# Fresh evaluation cases

Give each worker only its case's `TASK.md` and case evidence or pristine fixture. Do not give workers `evaluator/`, sibling cases, or evaluation results. Copy the implementation fixture into a new working directory for each run. No network, dependency installation, CI, paid services, or model trials are needed. Each case is designed for a focused 5–8 minute pass.

The implementation's local HTTP server is the target runtime, not a production connection. The server keeps submission results only in memory. Restart it to reset the scenario.
