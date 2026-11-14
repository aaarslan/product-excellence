# Product Excellence

### Build the outcome. Verify the handoff.

A product-judgment skill for agents working on an idea, an existing experience, or a requested feature. It follows the user's task past the interface: to a usable export, a confirmed action, a recoverable failure, or the next meaningful step.

**Outcome → obstacle → intervention → replay.** Find the result worth delivering, locate what prevents it, make the smallest complete improvement, and exercise the result where it will actually be used.

A prettier screen is not necessarily an easier task. A valid response is not necessarily a truthful success. Good implementation is not evidence that customers will adopt it.

## What this looks like in practice

In a local study of [Mr. Data Converter](CASE-STUDY.md), an incomplete quoted cell could silently become different data. Fixing the parser alone still left the default JSON output unusable for ordinary quoted text. The skill-assisted implementation followed the result through copying and parsing, preserving quotes and backslashes and rejecting duplicate keys.

Independent review then caught a new precision bug in that implementation. The final demonstrator blocks unsafe numeric conversion and offers an explicit text-preserving choice. The failure and correction are both retained, alongside the no-skill baseline.

![The corrected demonstrator preserves an exact identifier after an explicit text-mode choice.](case-study/evidence/screenshots/demonstrator-precision-recovery.jpg)

This is an existing open-source utility, not a fabricated app. It is also a legacy project, not a customer engagement or proof of adoption. The [case study](CASE-STUDY.md) includes the pinned source, runnable copies, actual browser observations, and limitations.

## Use it

After installation, try a concrete journey:

```text
$product-excellence Improve the CSV import journey in this repository. Follow it from a realistic input through the result the user actually uses. Implement one focused improvement, preserve existing expert capabilities, and verify the handoff plus one error or interruption. Do not deploy or change external services.
```

Replace “CSV import” with your actual journey. In Claude Code, invoke `/product-excellence` instead.

For a review, not implementation:

```text
$product-excellence Audit this onboarding journey. Identify the biggest obstacle to a useful result and recommend one focused improvement. Do not edit files or run state-changing workflows. Distinguish observed defects from hypotheses.
```

For an idea, supply the evidence and decision: “Should we build this, improve the workaround, or stop? What smallest commitment would change the answer?” The skill does not default to interviews, a large build, or a commercial model for a noncommercial tool.

## Where it helps, and where it stays out

- **Assess:** separate problem evidence from adoption and willingness to pay. Compare alternatives, reachable distribution, switching effort, and cost to serve.
- **Improve:** remove the binding obstacle, not merely the unattractive screen. Preserve useful information, recovery, and expert workflows.
- **Build:** deliver a user-complete slice, including affected states and downstream use. A placeholder or success-shaped failure is not completion.

Mechanical debugging, import fixes, refactors, translation, and copy-only tasks stay bounded. No mandatory scorecard, business report, recorder, benchmark, universal visual style, or new dependency. Existing project instructions and the user's requested scope take precedence.

## Install

No runtime dependencies. The installable folder contains only `SKILL.md` and `LICENSE`; examples and evaluations are optional development material.

Clone the repository or download its ZIP:

```sh
git clone https://github.com/aaarslan/product-excellence.git
```

From its root, copy the **inner** `product-excellence` folder into your target project:

| Host | Destination | Invocation |
| --- | --- | --- |
| Codex CLI / IDE | `.agents/skills/product-excellence/` | `$product-excellence` |
| Claude Code | `.claude/skills/product-excellence/` | `/product-excellence` |

Check for an existing copy before replacing it. Retain `LICENSE`. Remove only that folder to uninstall. You can also ask an agent to read `SKILL.md` directly without installing it.

Actual discovery and metadata parsing passed in an isolated project using Codex CLI `0.167.0-alpha.4`, with networking blocked and no model inference. This does not prove implicit triggering or compatibility with other hosts. Claude instructions follow its documentation but were not host-tested. See the [Codex docs](https://learn.chatgpt.com/docs/build-skills), [Claude docs](https://code.claude.com/docs/en/skills), and [Agent Skills format](https://agentskills.io/specification).

## Evidence, not a performance promise

[Evaluation](EVALUATION.md) includes negative and tie results from earlier synthetic comparisons, the real-code paired study, independent review, and the separately corrected demonstrator. The real-code trial supports a concrete improvement on common JSON cases, not a general win rate. No productivity, conversion, revenue, or adoption uplift is established.

The skill is instruction text, not a sandbox. Tests and recommendations do not authorize outreach, publication, spending, deployment, or production changes. Use synthetic data in public examples and review diffs before applying them.

## License and provenance

The skill, new documentation, and synthetic evaluation material are [MIT licensed](LICENSE), copyright Abdallah Arslan. The open-source case study retains Shan Carter's MIT license and bundled third-party notices; see [case-study provenance](case-study/PROVENANCE.md). No affiliation or endorsement is implied. Earlier supplied private material is not redistributed or relicensed.
