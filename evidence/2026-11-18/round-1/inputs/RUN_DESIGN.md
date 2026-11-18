# Run notes

These are temporary analysis fixtures. No candidate skill, attachment, or other agent files were read. Inputs and criteria are frozen before worker outputs.

Run no-skill/current-skill/new-skill with the same model, reasoning, tools, time limit, and task text in fresh sessions and isolated directories. Copy only the selected case inputs into each worker context, plus its assigned skill. Do not give workers judge files or other arms' output. Story Break gets all four files and roughly fifteen minutes; retain the actual HTML. Word limits include examples and headings.

One matched set per case plus literal scope probe A is the minimum; fresh repetitions help distinguish noise if budget permits. The other scope probes are optional.

Randomize neutral arm labels for the judge. For Story Break, inspect and exercise artifacts before reading final explanations. Use identical browser conditions, separate empty and legacy-seeded storage runs, and laptop/390px views. To seed sample-storage.json, set each key to JSON.stringify(value), then reload that artifact. Verify direct-file/offline use; do not substitute a web-server-only check. Record untested behavior honestly.

Judge with the frozen criteria, record material pairwise differences and ties, then reveal arm identities. Keep gains, regressions, and scope compliance separate. Infrastructure failures should be rerun under matched conditions. Any subsequent fixture/rubric change creates a new experiment and must not be tuned silently to observed outputs.
