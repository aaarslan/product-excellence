# Invitation review

## Recommendation
Use the one-engineer-week budget to make workspace-wide access unmistakable before the initial send. Preserve current roles and enforcement; do not imply project-scoped access or attempt the unestimated permission migration.

The binding obstacle is an incorrect access model, not button discoverability. Four of six admins expected project-only access when starting from a project; two noticed the workspace heading before sending, so a heading alone is not reliable protection. An anonymized incident demonstrates unintended disclosure within the correctly enforced workspace role. This is a mismatch between intent and granted access, not evidence of an authorization bypass.

## Proposed slice to test
- Identify the destination workspace prominently. State next to the role selector: “This invitation gives access to all content in this workspace, not just this project.”
- Describe each role accurately: Viewer reads all workspace content; Editor modifies all workspace content; Admin also manages members and billing. Keep all three roles available and retain existing permission semantics.
- Before initial submission, require an explicit acknowledgment of full-workspace access, tied to the selected role and workspace. Keep email and role editable and preserve them on errors. Provide a clear cancel path for an admin who needs project-only sharing; do not offer a nonexistent alternative.
- Do not add the same confirmation to ordinary resends, which do not change access. Keep existing admin role-change capabilities intact. Avoid silently changing the Editor default in this experiment, which would confound the result.

The principal tradeoff is deliberate friction for experienced admins versus preventing consequential accidental disclosure. A targeted acknowledgment is worth testing, but it may become habitual clicking and is not a substitute for project permissions. Compare explicit scope copy alone with copy plus acknowledgment rather than assuming a checkbox solves comprehension.

## Next test and decision
Use a local interactive prototype with synthetic accounts and six representative admins, including frequent inviters. Cap preparation and sessions at two days before committing the remaining engineering time. Test both project-entry and workspace-entry scenarios, counterbalancing the two variants. Ask participants to invite a collaborator who must see only one project, without prompting them about scope; observe whether they stop rather than submit. Then test a legitimate workspace-wide invitation and a resend. Check keyboard access, focus order, and screen-reader presentation of scope and confirmation.

Proposed decision gates, not established benchmarks: all six correctly explain scope before committing; none sends in the project-only scenario; at least five complete the legitimate invitation without assistance. Prefer copy alone if it meets those gates. Prefer acknowledgment only if it prevents mistakes that persist with copy alone without materially obstructing legitimate invitations. Any continued mistaken send fails the safety objective; mixed results require refining and repeating the test, not declaring success. This small study supports a design choice, not a population-level safety claim.

## Important adjacent defect
Separately, the current success toast precedes server confirmation and can falsely reassure users after rejection. Correctness should not depend on the scope experiment: show a submitting state, show success only after API confirmation, preserve retryable inputs on failure, and reconcile the pending row. Label accepted API-created invitations “Awaiting acceptance,” without implying email delivery, and announce asynchronous status changes accessibly. Make Resend/Revoke keyboard- and touch-reachable rather than hover-only. Fit this bounded repair into the week if feasible; if not, explicitly sequence it next rather than expanding the scope into fine-grained authorization.

## What the packet establishes and does not
There were 246 Send clicks and 229 successful API responses across 310 opens. These are event counts, not unique-user conversion or collaboration success. Repeated opens, absent delivery data, and missing client acceptance tracking prevent conclusions about activation or why invitations remain pending. The 14 support classifications overlap and are not deduplicated; they indicate themes, not distinct affected-user counts. Existing durable acceptance audit events could later support an acceptance measure without inventing a new event source.

The evidence supports prioritizing access comprehension over cosmetic redesign, but does not establish the effectiveness of either proposed design, demand for project-level permissions, production incident prevalence, or conversion lift. This review used only the supplied packet; no runtime, prototype, code, accessibility, or user testing was performed. No customer identifiers or outreach instructions are included, and no accounts, roles, permissions, or external state were changed.
