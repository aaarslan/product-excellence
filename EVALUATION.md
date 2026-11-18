# Evaluation

Development study: **November 18, 2026**. The tasks and data are synthetic. The purpose is to find useful changes in actual outputs, retain failures and ties, and decide whether the revised skill earns its added instructions. This is not a claim about general model performance, adoption, revenue, or human preference.

## Current decision

**Keep the revision as a draft for review; the broad release gate is not met.** The work adds useful interaction guidance and a more usable package, but the exact final revision has not demonstrated material gains over the committed skill in more than one task type.

On the fresh Night Shift build, one independent reviewer preferred the final candidate over the committed skill and the second called a tie. Both preferred it to the no-skill output. On the photo-scanning service decision, the final candidate tied the committed skill; both were preferred to no added skill. The strongest concrete gain is preserving a visitor’s context when a plan changes. That is worth inspecting, but it does not establish broad superiority or that people will love using the skill.

The first candidate also showed mixed preferences and ties, with an unresolved preparation-access assumption. Those results are retained below and are not silently credited to the final wording. The appropriate claim is a research-informed, useful experimental direction with transparent limits. A stronger release claim needs new evidence from real use, rather than additional synthetic tasks selected until the candidate wins.

## What was compared

Each case used three fresh workers: **no added skill**, **the committed skill at `969eb34`**, and **a frozen candidate**. The same task, source materials, tool availability, and output limits applied within a case. Implementation workers produced actual HTML; decision workers produced bounded recommendations.

| Version | Words | SHA-256 | Where tested |
| --- | ---: | --- | --- |
| Committed skill | 1,034 | `065809057187309a70866be249f49b9da1ccc75f8263c59b089b9e080988748b` | Both rounds |
| First candidate | 1,339 | `9fbf261cc43e91b68aad02828b9958f6d982f24be95234985341e8c962d067e6` | Story Break, lending cupboard, worktree command |
| Revised candidate | 1,470 | `2f4c82f12a73765b23f4eecdd2bd1df2cb1a0c17af5f579e75ebf8a3156d89bd` | Fresh held-out tasks in round two |

Word counts are whitespace separated. The installable skill matches the last hash. Do not attribute the first candidate’s implementations to the later wording.

The first candidate was frozen at 14:53:20 UTC before the independent case author returned the tasks. The revision was frozen at 15:27:44 UTC before a different fresh-context author was assigned new cases. Neither author read the skills, earlier outputs, or the supplied Jobs article. The second round was deliberately added after weak first-round results; it is an adaptive development study, not a pristine benchmark.

## Round one: useful work, limited differentiation

The independently authored [tasks and criteria](evidence/2026-11-18/round-1/inputs/) preceded the outputs. Reviewers received anonymous A/B/C artifacts and the criteria, without skill texts or arm identities. Two reviewers independently examined Story Break. A separate reviewer examined both written cases.

| Case | Candidate vs committed skill | Candidate vs no added skill | What the evidence shows |
| --- | --- | --- | --- |
| **Story Break:** improve a family writing activity | One reviewer narrowly preferred the candidate; the other called a tie | Both reviewers modestly preferred the candidate | The visible first-line action inserts an editable beginning, moves the caret, and condenses prompts. Exact prompt undo and draft recovery also help. All arms completed the main preservation/reading flows. |
| **Lending cupboard:** design a feasible four-week service | Narrow preference for candidate | Tie | Candidate and baseline respected the centre’s 18:00 Thursday closing time; the committed-skill output used 18:15. Both preferred outputs left physical preparation access unresolved. |
| **Worktree command:** reduce wrong-checkout execution | Tie | Tie | All three independently proposed substantially equivalent opt-in worktree pickers with deliberate selection, stale-selection rejection, and compatibility protection. |

These are not three clear wins. Story Break has reviewer disagreement; the service preference is narrow and qualified; the CLI case adds no demonstrated advantage. The no-skill outputs were strong and remain available beside the skill outputs.

### Story Break: inspect the interaction, not just the explanation

The best moment in the candidate is **Start with this line**. It turns the character/place opening into editable text, puts the caret after “because,” and collapses the preparation cards into a reminder. A writer can complete the thought immediately. This addresses the fixture’s observed hesitation with a concrete interaction rather than another instruction paragraph.

There is a cost: changing a prompt after starting requires reopening the cards. One reviewer considered the transition a modest net advantage over the committed skill; the other preferred to call the tradeoff a tie. Neither review establishes that real children would choose it.

All three passed the coordinator’s same ten DOM checks: startup, exact draft/title storage, one-prompt replacement, finish/read, unfinished-work recovery, selected storage-failure recovery, exact legacy draft/prompts, complete legacy stories, persistent recoverable removal, and script errors during those paths. These are ten checks on each of three artifacts, not thirty independent product trials.

Independent reviewer scripts additionally exercised editing/recovery, nonblocking timer expiry, and other selected failure paths. They found no destructive defect in the exercised flows. See [review one](evidence/2026-11-18/round-1/reviews/story-review-1/REVIEW.md), [review two](evidence/2026-11-18/round-1/reviews/story-review-2/REVIEW.md), and the [matched results](evidence/2026-11-18/round-1/checks/common-dom-results.json).

### The failure that changed the instructions

The lending candidate assigned two preparation hours to checking equipment without placing those checks in an authorized access session. The no-skill output made the same assumption. The committed-skill output handled preparation access better but explicitly extended its fallback beyond closing time. None was a completely verified operating plan.

This exposed a general weakness: a plausible time budget can conceal a plan that cannot occur. The revision asks the agent to trace preparation, commitment, use, handoff, and readiness for the next use, reconciling timing, access, ownership, and capacity together. It also makes comparison of alternative mechanisms more concrete and asks the agent to put the decisive benefit in the artifact before secondary features.

The [original outputs](evidence/2026-11-18/round-1/outputs/) and [written review](evidence/2026-11-18/round-1/reviews/written/REVIEW.md) remain unchanged. They were not repaired and relabeled as successful evaluations.

## Round two: fresh tasks for the exact revised skill

The [fresh briefs and rubric](evidence/2026-11-18/round-2/inputs/) were frozen independently before any second-round worker started. The cases were an offline visitor experience for a small arts event and a six-week library photo-scanning pilot. Each again used one no-skill, one committed-skill, and one final-candidate worker.

| Case | Final candidate vs committed skill | Final candidate vs no added skill | Consequential finding |
| --- | --- | --- | --- |
| **Night Shift:** create a shared visitor experience | One reviewer preferred candidate; second called a tie | Both preferred candidate | Its stop-specific replacement carries forward the current location, earlier activities and departure target. The committed-skill output asks for more manual context. The no-skill output rebuilds from the initial demo time. |
| **Photo scanning:** recommend a complete bounded service | Tie | Candidate preferred | Both skill versions verify the first exported photo on the participant’s receiving computer early. That important handoff behavior was already present with the committed skill. |

### Night Shift: useful adaptation, with real counterweights

All three independently chose a shared-visit planner. Each supplied an immediate route, two people’s interests, schedule logic, access information, and the six actual activities. The concept itself is not a new invention attributable to the revision.

The final candidate’s meaningful difference appears when a plan breaks. In the coordinator’s focused check, replacing the second stop at 18:58 retained the exact first stop and its times, kept the 19:20 departure target, and allowed one-action undo. The committed-skill output opened a general replan form at 18:20, requiring the visitor to supply the actual time, floor and completed-room exclusions. The no-skill output explicitly cleared visited marks and restarted at 18:20. These are executed DOM observations, not inferred benefits from a worker’s explanation. See the [focused check](evidence/2026-11-18/round-2/checks/recovery-check.cjs) and [recorded results](evidence/2026-11-18/round-2/checks/recovery-results.json).

Counterweights matter. The committed skill’s broader interests produced a better 60-minute watching/making compromise. The no-skill planner put uncertain postcard making last, protecting the earlier timed demonstration; both skill outputs placed it before a demonstration in one 90-minute route, leaving only one minute of queue tolerance after travel. They disclosed the free-seat assumption and offered recovery, but the initial ordering was less robust. The final candidate also interpreted some interests more narrowly, sometimes omitting making rather than finding a broader compromise.

The first reviewer gave all three assessable Pass judgments and preferred the final candidate narrowly over both alternatives. The second gave the candidate and committed skill Pass, the no-skill output Partial, and tied the two skill outputs. The difference in judging the no-skill finish boundary is preserved: one accepted its explicitly stated last-activity finish; the other considered the omitted descent a material gap in a visitor’s total time. Neither judgment was rewritten to produce consensus.

Both reviewers independently checked **462 initial control combinations** across the three artifacts—216 candidate, 96 committed skill, 150 no skill—against the event facts, plus selected recovery cases. These counts differ because the products expose different interests. They are scenario coverage within three implementations, not independent trials, a performance score, or a win rate. Read [review one](evidence/2026-11-18/round-2/reviews/night-review-1/REVIEW.md) and [review two](evidence/2026-11-18/round-2/reviews/night-review-2/REVIEW.md) for acceptance boundaries and tradeoffs.

### Photo scanning: a valuable capability retained, not a new win

All three recommended a rehearsal before public appointments, a limited assisted offer, eight possible appointments within the available weeks, and bounded staff work. Their word counts and schedule arithmetic passed. No demand, price, workload, or transfer reliability was represented as measured by this evaluation.

The final candidate and committed skill both make the first photo usable on the participant’s own receiving computer before continuing the session. That protects against the fixture’s failed transfer. The no-skill proposal remained credible and offered a less restrictive access route, but verified later and allowed an explanation of future access instead of always observing it on that receiving device.

The judge preferred both skill outputs to no added skill and tied them with each other. A five-photo offer and a flexible ten-photo ceiling with five priorities have balanced benefits; the notes do not establish an optimal size. See the [complete written review](evidence/2026-11-18/round-2/reviews/written/REVIEW.md). This result supports retaining the earlier handoff discipline; it does not demonstrate additional service-planning value from the revision.

## Scope, installation, and verification boundaries

The literal-scope request was: “Return exactly this sentence, with no preface or changes: Your draft is saved on this device.” All three first-round arms returned exactly the sentence. A fresh worker applying the final revision also returned exactly the sentence. These are explicit-application scope probes, not measurements of implicit host routing.

The final skill passed the bundled skill-format validator. The actual Skills CLI **1.9.0** installed the local repository source into disposable project directories for Codex and Claude Code. The installed `SKILL.md`, `LICENSE`, and `agents/openai.yaml` matched the source byte for byte. No user/global skill directory was changed. This verifies packaging and project paths, not actual host discovery or automatic invocation. A separate current Codex discovery attempt was blocked by the environment’s read-only application database; historical discovery evidence applies only to the older version.

**Browser-dependent acceptance remains unverified.** The environment blocked Chromium execution and the cloud browser rejected local file URLs. The tests used **jsdom 27.2.0 on Node.js 24.22.3**, executing the actual inline application scripts against a DOM. Storage probes used artificial HTTPS origins; one later jsdom harness used file-URL metadata. Scroll/dialog/download behavior was stubbed where needed. Neither setup is a real browser file-URL check. This does not prove direct-from-disk storage, true offline behavior, rendered layout, native keyboard traversal, accessibility, browser downloads, or real-user success. No application screenshots are offered as new-round evidence.

The README’s original SVG header was rendered and visually inspected separately. That check says nothing about the evaluated applications.

## Method and limits

The predeclared release gate was useful material improvement over the committed skill in more than one task type, without an unresolved severe regression. There is no aggregate score or win rate. A non-tie requires a concrete difference in success, understanding, effort, recovery, or enjoyment; novel terminology and feature count earn nothing by themselves.

Each arm ran once per task. Workers inherited the same parent model settings, but no independently pinned backend snapshot, seed, temperature, per-arm token count, latency, or dollar cost was exposed. This supports inspection of recorded outputs, not reproducible stochastic model comparisons or efficiency claims. Reviewers were language-model workers, not independent human product teams.

All workers shared a filesystem and were explicitly instructed not to inspect siblings or evaluation materials. That is instructional separation, not a security boundary. The new tasks are selected synthetic development cases, not a representative sample of products. All recommendations remained local artifacts; there was no user research, outreach, paid API, deployment, or production change.

Two procedural corrections are preserved. The first case author shortened rubric/run notes after the earliest workers started but before any outputs were read; substantive criteria and task inputs were unchanged. The initial shared DOM harness incorrectly assumed every shelf item was an article element; one artifact used a whole button. Correcting that adapter fixed false failures without changing applications or behavioral assertions. Both manifests and both harness/results versions are retained in the [packaging notes](evidence/2026-11-18/round-1/PACKAGING.md).

## Inspect or reproduce

Start with [the evidence index](evidence/2026-11-18/README.md). It links frozen instructions, tasks, anonymous reviews, arm maps, raw outputs, and verification scripts. Portable scripts adjust paths, dependency resolution, and rerun filenames; one also translates recorded violations into a failing process exit status. Original scripts and findings are preserved. Reruns write separate files.

The earlier [November 14 evaluation](EVALUATION-2026-11-14.md) is retained byte for byte. The [public-code case study](CASE-STUDY.md) still documents both a useful JSON handoff improvement and a newly introduced numeric-precision regression, with its separate correction. That history is not evidence for the exact current revision.

## What would justify a stronger release claim

The next useful evidence is a small set of authorized real-product applications with an observed starting problem and actual people using the result. Compare the committed skill and revision under the same brief; inspect the resulting interactions in a real browser; then observe whether the changed experience reduces effort, supports recovery, or earns repeat use. Preserve cases where a capable agent already does as well.

That work would address gaps this study cannot resolve: rendered quality, comprehension, whether the distinctive moment helps in practice, and whether the skill earns its extra context across tasks. No outreach or future study is claimed to be scheduled. The current pull request remains a reviewable candidate, with the evidence needed to accept, narrow, or reject its claims.
