# Packaging notes

The frozen instructions, task inputs, worker HTML/text outputs, and original reviewer judgments are retained without rewriting their findings. `runs.json` and `blind-map.json` reveal arm identities after review. Original absolute scratch paths in historical manifests identify the run environment; the portable repository equivalents are `inputs/`, `instructions/`, and `outputs/` here.

`checks/common-dom-check-original.cjs` preserves the coordinator’s matched harness. `common-dom-check.cjs` changes only module resolution, fixture/output locations, and the rerun report filename. The initial harness and initial results are retained too: it incorrectly assumed every shelf item used an article element; one implementation used a whole button. The final adapter accepts both structures. The applications and the behavioral assertions were not changed.

For independent review scripts, `checks-original.cjs` is the original file; `checks.cjs` is a portable copy where available. Path and dependency changes do not alter the assertions. Portable scripts write `*-rerun.json`, leaving recorded results intact. A successful assertion documenting that a reversal control is absent does not mean that variant supports reversal; read the review’s actual judgment.

The final input manifest notes a timing correction: the independent author shortened the rubric and run notes after the first workers had started but before any worker results were read. The tasks and substantive criteria were unchanged. Both input manifests are preserved.

Only selected application behavior was executed in jsdom. Browser execution was blocked by the environment. No rendered layout, direct file-URL storage, native keyboard traversal, assistive-technology behavior, or real-user outcome is claimed.

The raw `outputs/r04/RESULT.md` retains its original extra blank line at EOF. Its bytes are preserved rather than normalized for a whitespace-only diff warning.
