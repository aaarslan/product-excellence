# Evaluation: observed outcomes, not a general performance claim

Evaluation date: 2026-11-14. Earlier comparison tasks, companies, accounts, and service data are synthetic. The later case study uses public open-source code with synthetic entered data. No customer interviews, production deployments, or adoption results are represented.

## Bottom line

The current skill is an experimental, self-contained instruction file with a concrete workflow and runnable examples. One real-code comparison favored its common JSON handoff behavior but also exposed a new precision regression, repaired separately. It is not established as generally better than a capable baseline. The written comparisons mostly hit the rubric ceiling, making them poor instruments for small differences. We preserved the negative and tie findings rather than manufacturing a winning score.

| Comparison | Observed result | Meaning |
| --- | --- | --- |
| Earlier lean draft, three paired cases | Assessment tie; baseline narrowly preferred in review; both builds passed simulated-DOM checks | No demonstrated advantage; motivated a more concrete intervention |
| Revised round one, two written pairs | All four 10/10 on five 0–2 dimensions; blind judge narrowly preferred baseline on both | Calibration weaknesses despite satisfying broad task criteria |
| Revised round one, implementation pair | Both passed real local service + simulated-DOM checks; both completed the observed Chromium journey | Working synthetic example, not comparative superiority |
| Corrected round two, two fresh written pairs | All four 10/10; blind judge called both ties | Earlier specific weaknesses not observed; not proof of general repair or uplift |
| Final descriptor/static boundaries | Three positive and three negative requests matched intended routing | Human-like descriptor reasoning, not measured host activation |

## Real public-code study and final artifact

See [CASE-STUDY.md](CASE-STUDY.md) for the real-code findings and screenshots. Source: Mr. Data Converter at pinned commit `e5d6cb616eafe2d16beb6c7f0399d7ca5c142304`. The repository was selected for an inspectable, dependency-free local workflow, not random sampling. It is a legacy project. No real customer or production service was involved.

Two fresh workers received identical task/source copies; only one loaded the skill. One trial per arm. The task and pre-run criteria are retained. A fresh blinded reviewer inspected anonymized source and executed independently authored checks without reading the skill, reports, or coordinator findings. It preferred the skill-assisted common-data journey but identified unsafe-integer corruption as a blocker. The coordinator independently verified actual Chromium output and copied JSON. Arm X was skill-assisted; Y was baseline. Filesystem separation was instructional, not a security boundary.

Both arms improved editing recovery. The skill-assisted arm additionally preserved JSON quotes/backslashes and rejected duplicate keys; the baseline retained inherited serializer defects. The skill arm introduced numeric precision loss. This failure remains in the frozen trial. The separately repaired demonstrator passed 17 grouped worker checks and 19 independent precision/text cases, plus actual browser copy-and-parse recovery. These are not 36 independent trials or a win rate. Non-JSON correctness and general data safety remain unproven.

The final skill adds a focused handoff-verification instruction after that failure. It is 1,034 whitespace-separated words, SHA-256 `065809057187309a70866be249f49b9da1ccc75f8263c59b089b9e080988748b`. That wording has not been run through another paired implementation trial; do not attribute the earlier code to it. Actual Codex `0.167.0-alpha.4` discovery was rerun with this exact artifact and passed, in an ephemeral project with credentials absent and outbound networking blocked. No model inference occurred. [Sanitized host evidence](case-study/evidence/host/README.md) proves discovery/metadata parsing only, not implicit triggering or quality.

Reproduce checks from the repository root, using Node.js 18+:

```sh
(cd case-study/control && node tests/editing.test.cjs)
(cd case-study/skill-trial && node tests/conversion.test.js)
(cd case-study/demonstrator && node tests/conversion.test.js)
(cd case-study/evidence/blind && node correction-check.cjs)
```

Run evidence-writing independent scripts in a disposable copy if preserving recorded outputs. Packaged correction-check paths were adjusted for the repository layout; its status-wording assertion was updated after a copy clarification, without changing data/output assertions. That clarification and a visible identifier/text-mode hint changed no numeric behavior. The corrected package's tests were rerun. Original blinded judgments remain historical records; later browser observations and wording clarifications supersede their corresponding unverified/UI-copy notes, not their comparison findings.

The browser screenshots contain only the local application and synthetic data. No personal browser chrome, credentials, or private customer material is included. Source licenses and upstream authorship are retained. The skill's MIT license does not overwrite third-party terms.

Per-arm tokens, dollar cost, and inference latency were not available. No external paid API, CI, deployment, installation into user/global skill locations, publication, or upstream contact occurred. Worker count and checks are reported rather than invented efficiency metrics. The real study is one selected task with language-model review, not an independent human usability or adoption study.

## Earlier synthetic comparisons: method

The revised candidate was frozen before a separate fresh-context designer supplied three cases and their rubrics. The designer was instructed not to read the candidate, earlier tests, or outputs. Each case ran in two fresh-context workers: task/evidence alone and task/evidence plus the frozen skill. Both had the same tools and constraints. There was one run per arm, no temperature sweep, no search for a favorable seed, and no external paid model API or CI.

For written tasks, a separate fresh-context judge received anonymized X/Y outputs, the source evidence, and the predefined rubric, but not arm identities or the candidate. It evaluated material judgment, not required phrases. The coordinator then read the actual outputs and judgment. Arm mappings are retained in `evidence/checks/arm-map.json`. The judge did not receive execution traces, so its scope-compliance assessment was output-based; the coordinator observed worker reports and artifacts.

Workers share the underlying filesystem. Separation was instructional, not a security sandbox. They were told not to inspect sibling outputs. The built-in worker runtime inherited the same parent model settings; an exact independently pinned model/version and sampling configuration were not recorded. This is a practical development comparison, not a reproducible model benchmark.

### Round one and the correction

The first revised file was frozen at 01:32:43 UTC, SHA-256 `5aff48686c45e51d0eac2d3dc86c13d709c49414c9f3f1b00e18b94a509e5a6d`. It had 939 whitespace-separated words. Raw outputs, evidence, rubric, and the frozen file are included.

The decision case concerned a customer-requested rules builder under renewal pressure and constrained capacity. The review concerned workspace invitations, ambiguous access scope, and premature success feedback, with a contractor-safe output requirement and an untrusted embedded request for outreach.

The skill arm introduced an unsupported second supervisor and a provisional but ungrounded 80% usage gate. Its review made the known false-success defect too easy to defer behind a design hypothesis. The baseline was more calibrated on both. Neither output incurred a severe-defect rubric cap; both remained useful and avoided the restricted identifiers/outreach.

Two narrow corrections followed: do not invent people or precision to disguise thin evidence; do not defer known false-success/data-loss defects merely to test optional presentation changes. No implementation guidance was changed. This is a documented intervention based on observed weaknesses, not repeated tuning on the same cases.

### Fresh round two

The independent case designer then produced two unseen tasks without seeing the revised candidate, earlier outputs, or grading: an accounting/export commitment under integration uncertainty, and a grocery-substitution flow with false success, timeout consent ambiguity, and a frontend-only budget. The corrected file was frozen at 01:47:35 UTC, SHA-256 `686431faca7c8c5c2226da04f346e2cc32ab27e29bf26aee044d655688a5e174`, 976 words.

Four fresh workers produced outputs of 248, 248, 248, and 247 words, all under the requested 250-word limit. The new blind judge reported ties at 10/10 on both tasks. The skill output did not invent numeric gates and put truthful outcomes first. The control also did this. The results support acceptable performance on these cases, not a claim of causal improvement or statistical equivalence.

## Implementation evidence

The support handoff task required actual local code, not a plan. Both workers preserved the service byte-for-byte: SHA-256 `30426c92b47cec7040657297e65286b2c2cc96a70afe0edfc19c0fbdfcdb3cff`. Neither added dependencies, CI, or source comments/docstrings. The code is retained, including independent worker-created tests.

The coordinator reran both tests against fresh real Node services. Both passed. The UI DOM in these automated tests is simulated: these checks establish request/state behavior, not layout or actual keyboard accessibility. The skill test also simulated offline/load recovery and focus restoration. The source uses a 10-second timeout, but no real 10-second timeout experiment was performed.

Separately, actual Chromium was used against the same local service: ready-only selection, sequential batch progress, intentional first-attempt HTTP 503, partial success, failure-only retry, reload persistence, search/priority filtering, actual CSV downloads, empty state, Space/Enter interaction, and stopped-service failure. Both arms behaved correctly in the observed journey. See [browser observations](evidence/checks/browser/OBSERVATIONS.md) and [case study](CASE-STUDY.md).

The skill arm also had no visible control overflow at 393 CSS pixels using ordinary browser zoom (document width 388). This was not a mobile-device test. Exact 375px rendering, equivalent narrow control-arm comparison, full sequential Tab order, screen-reader output, assistive-technology compatibility, and real-user task success remain unverified. Browser screenshots were inspected internally, not included in this release.

### Reproduce the local checks

Use Node.js 18+ and a fresh service. No installation or credentials. From each respective implementation directory:

```sh
# evidence/round-one-outputs/build-control
PORT=4174 node server.mjs & fixture_pid=$!
trap 'kill "$fixture_pid" 2>/dev/null || true' EXIT
sleep 0.3
node workflow.test.mjs
```

```sh
# evidence/round-one-outputs/build-skill
PORT=4175 node server.mjs & fixture_pid=$!
trap 'kill "$fixture_pid" 2>/dev/null || true' EXIT
sleep 0.3
node workflow.test.mjs
```

Run each block in its own shell. A port already in use or a slow startup can invalidate the run; inspect the server output rather than treating that as an application failure. Tests assume the documented ports. The demonstration uses synthetic in-memory state and loopback networking only. Do not run it against production or deploy its server.

## Triggering and adversarial boundaries

The final descriptor check contains three likely triggers (feature implementation, audit-only review, noncommercial idea assessment) and three exclusions (mechanical defect, refactor, translation). All matched the intended classification. This is not a host routing test. At that stage, neither Codex nor Claude discovery/installation was exercised. The later isolated Codex discovery check is described above.

The actual invitation-review task tested a restricted-output audience and an embedded outreach request; neither arm disclosed the restricted identifiers or reported acting on the request. Static review also checked a malicious screenshot instruction, audit-only scope, and explicit implementation scope. This does not establish comprehensive injection resistance. Skill prose is not a sandbox or permission system.

## Time, cost, and uncertainty

The round-one freeze and round-two freeze were 14 minutes 52 seconds apart. That interval includes worker work, coordination, browser setup, and revision; it is not per-arm latency. The independent rerun of both implementation tests took about 7.2 seconds combined. Browser setup had environment/network-namespace friction, so total elapsed effort is not a useful skill-overhead measure. Exact per-arm token usage, dollar cost, and full wall-clock attribution were not exposed or recorded. No claim of cheaper or faster operation is supported.

The sample is small, synthetic, and selected for development utility. Each arm ran once; judges were language-model workers, not blinded human product teams. No confidence intervals, significance, adoption, revenue, conversion lift, or general win rate should be inferred. The likely next useful evidence is an authorized real-project application with a named starting problem and observed user outcome, not another round of prompt tuning to win these same tasks.

## Evidence layout

- `evidence/round-one-inputs/`: independently authored briefs, fixture, and rubric.
- `evidence/round-one-outputs/`: raw answers and runnable implementations.
- `evidence/round-two-inputs/` and `round-two-outputs/`: fresh held-out tasks and answers.
- `evidence/checks/`: frozen revisions, original input hashes (using pre-packaging paths), blind judgments, routing/static review, and browser observations/exports.
- `evidence/earlier-lean-evaluation/`: prior negative/tie evidence, retained rather than hidden.

Only the `product-excellence` folder, containing `SKILL.md` and its license notice, is installed. This evidence is optional development material and imposes no runtime recording or benchmark process on the skill.

## Release checks

The final skill passed the bundled skill-format validator. Both implementation JavaScript/test files passed Node syntax checks. All relative Markdown links resolved, and all three copies of the revised example service matched the protected hash. The coordinator inspected the release text and an independent bounded review found no material contradiction with the recorded judgments/browser observations or private-context leakage in the four public-facing documents. No installation, publication, remote repository update, or CI run occurred.
