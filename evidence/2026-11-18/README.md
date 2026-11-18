# November 18 development evidence

This folder contains the recorded comparison behind the [evaluation report](../../EVALUATION.md). It is optional reading and is not installed with the skill.

## Compare the actual outputs

| Case | No added skill | Committed skill | Candidate |
| --- | --- | --- | --- |
| Story Break, first candidate | [HTML](round-1/outputs/r01/index.html) · [note](round-1/outputs/r01/RESULT.md) | [HTML](round-1/outputs/r02/index.html) · [note](round-1/outputs/r02/RESULT.md) | [HTML](round-1/outputs/r03/index.html) · [note](round-1/outputs/r03/RESULT.md) |
| Lending cupboard, first candidate | [Recommendation](round-1/outputs/r06/RESULT.md) | [Recommendation](round-1/outputs/r04/RESULT.md) | [Recommendation](round-1/outputs/r05/RESULT.md) |
| Worktree command, first candidate | [Recommendation](round-1/outputs/r08/RESULT.md) | [Recommendation](round-1/outputs/r09/RESULT.md) | [Recommendation](round-1/outputs/r07/RESULT.md) |
| Night Shift, final revision | [HTML](round-2/outputs/r14/index.html) · [note](round-2/outputs/r14/RESULT.md) | [HTML](round-2/outputs/r15/index.html) · [note](round-2/outputs/r15/RESULT.md) | [HTML](round-2/outputs/r13/index.html) · [note](round-2/outputs/r13/RESULT.md) |
| Photo scanning, final revision | [Recommendation](round-2/outputs/r16/RESULT.md) | [Recommendation](round-2/outputs/r17/RESULT.md) | [Recommendation](round-2/outputs/r18/RESULT.md) |

The HTML files are self-contained prototypes. GitHub displays their source; download a file to try it locally. Their intended browser behavior still needs the browser checks identified in the reports.

## Study map

| Material | Where to look |
| --- | --- |
| First frozen candidate and original skill | [Round 1 instructions](round-1/instructions/) |
| Original cases and independent rubric | [Round 1 inputs](round-1/inputs/) |
| Raw artifacts and recommendations | [Round 1 outputs](round-1/outputs/) |
| Two independent implementation reviews | [Review one](round-1/reviews/story-review-1/REVIEW.md), [review two](round-1/reviews/story-review-2/REVIEW.md) |
| Service and CLI comparison | [Written review](round-1/reviews/written/REVIEW.md) |
| Matched implementation checks | [Harness](round-1/checks/common-dom-check.cjs), [recorded results](round-1/checks/common-dom-results.json) |
| Identities and method | [Runs](round-1/runs.json), [anonymous map](round-1/blind-map.json), [protocol](round-1/protocol.json), [packaging notes](round-1/PACKAGING.md) |
| Exact final instructions and fresh inputs | [Round 2 instructions](round-2/instructions/), [independent tasks/rubric](round-2/inputs/) |
| Final-revision implementation reviews | [Review one](round-2/reviews/night-review-1/REVIEW.md), [review two](round-2/reviews/night-review-2/REVIEW.md) |
| Final-revision service comparison | [Written review](round-2/reviews/written/REVIEW.md) |
| Exact installation and scope evidence | [Installation](round-2/installation/VERIFICATION.json), [literal scope](round-2/scope-result.json) |
| Final-revision identities and method | [Runs](round-2/runs.json), [anonymous map](round-2/blind-map.json), [protocol](round-2/protocol.json), [worker envelope](round-2/RUNNER.md), [packaging](round-2/PACKAGING.md) |
| Independent release judgment | [Release audit](RELEASE-AUDIT.md) |

The release auditor’s suggested README wording correction was applied. The evaluation’s final decision and round-two summary were completed after that audit. The broad comparative gate remains unmet; opening a draft PR does not change that finding.

## Reproduce the recorded DOM checks

Use **Node.js 24**. The recorded runtime was 24.22.3. From the repository root:

```sh
npm ci --prefix evidence/2026-11-18 --ignore-scripts --no-audit --no-fund
node evidence/2026-11-18/round-1/checks/common-dom-check.cjs
node evidence/2026-11-18/round-1/reviews/story-review-1/checks.cjs
node evidence/2026-11-18/round-1/reviews/story-review-2/checks.cjs
node evidence/2026-11-18/round-2/checks/recovery-check.cjs
node evidence/2026-11-18/round-2/reviews/night-review-1/check.cjs
node evidence/2026-11-18/round-2/reviews/night-review-2/checks.cjs
node evidence/2026-11-18/round-2/reviews/night-review-2/edges.cjs
```

The pinned dependency is jsdom 27.2.0, used only for these optional study checks. No dependency is required to use the skill. Reruns produce separate `*-rerun.json` files; recorded results stay intact. Original scripts with run-environment paths remain alongside the portable copies.

These scripts execute the actual HTML application scripts against a DOM. They do not launch a browser, render a layout, or reproduce real user behavior. A static label/focus rule or a successful DOM event is not proof of keyboard accessibility, responsive layout, beauty, or adoption. Read each review’s limitations before interpreting a pass.

The worker-created checks are also retained with their artifacts. Some browser checks were prepared but could not run; their presence is not evidence of successful browser verification. The commands above are the portable checks actually rerun during packaging.

## Preserve the record

Frozen task and instruction hashes are retained in the round manifests. Artifact outputs and original judgments are not rewritten to match the release narrative. If you discover a test mistake, retain the original, document the correction, and rerun the same relevant assertion across all arms. If you change the skill, give the changed version its own evidence.
