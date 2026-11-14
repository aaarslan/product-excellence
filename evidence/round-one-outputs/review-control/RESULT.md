# Invitation review

## Recommendation
Use this month's engineer-week to test and ship a clear workspace-access disclosure at the initial invitation decision. Prioritize preventing unintended sharing over making Send faster. This is a scope-comprehension problem, not evidence that server authorization is broken.

Four of six admins expected project-only access; noticing the workspace heading did not reliably resolve that expectation. One reported incident resulted in unintended access to unrelated workspace content under the granted role. Keep the review and prototype materials anonymized.

## Proposed testable change
- Title the dialog “Invite to [workspace]” and show, beside the role control and above Send: “This invitation gives access to all content in this workspace, not just the current project.” Do not imply that project-only sharing exists.
- Explain the selected role explicitly: Viewer reads all workspace content; Editor modifies all workspace content; Admin also manages members and billing. Preserve existing role semantics. Changing the default to Viewer alone would not prevent the observed disclosure risk.
- Show a compact pre-send summary of recipient, workspace, and role, with the full-workspace scope prominent. Keep Cancel available so an admin who needs project-only sharing can stop. Compare this inline disclosure against the same disclosure with an explicit acknowledgment on initial send. Do not add acknowledgment to routine resends.
- Within the same flow, stop declaring success before the API confirms creation. Preserve entered values on rejection, provide an actionable error, and create the pending row only on confirmed success. Label it “Awaiting acceptance,” not as delivered. Announce success/error changes to assistive technology. Resend/Revoke must also be keyboard and touch discoverable, not hover-only.

The access disclosure is the primary product hypothesis. Truthful submission feedback is a separate correctness fix, not proof that disclosure works. If the full bundle exceeds the week, protect those two priorities and explicitly defer ancillary People-page work rather than presenting the flow as fully remediated.

## Most important tradeoff
An extra acknowledgment may prevent consequential sharing mistakes, but adds friction and can become a checkbox users ignore. Start with prominent, contextual disclosure and test whether acknowledgment adds measurable comprehension. Do not add a ritual to every resend. Neither variant satisfies users who actually require project-only access; do not spend the week attempting an unestimated authorization migration or describe disclosure as a substitute for it.

## Designer/engineer test agreement
Use synthetic recipients and a workspace containing multiple projects. Ask admins to invite a collaborator who should see only the current project, without coaching them about scope. Before sending, ask what the recipient could read or change and observe whether they stop when the available access exceeds the task. Separately test a legitimate workspace-wide invitation, backend rejection, acceptance-pending interpretation, and keyboard/screen-reader operation.

Compare current UI, inline disclosure, and disclosure plus acknowledgment in small moderated rounds. Record scope/role understanding, inappropriate sends, legitimate-task completion, time, and reasons for cancellation. Any observed unintended send warrants iteration; a small study with no errors is not proof of safety. Ship only after the team sees correct scope understanding and verified success/failure behavior, then monitor anonymized access-confusion reports.

Instrument API-confirmed creation separately from Send clicks and connect the existing accepted audit event to an invitation-level funnel, using a defined acceptance window. Deduplicate invitation attempts and support incidents before interpreting trends. Do not label API success as delivery or recipient acceptance.

## What the packet cannot establish
The six sessions suggest a serious failure mode, not its population prevalence or a causal lift from either proposed design. Last month's 310 opens, 246 clicks, and 229 successful responses describe attempts, not unique-user conversion; 17 clicks lack a reported successful response, but the packet does not establish their individual causes. There is no reliable delivery measure or acceptance funnel. The 14 overlapping, undeduplicated support classifications cannot establish incidence or rank distinct affected customers. Disclosure effectiveness, demand for project-only sharing, and migration cost remain unmeasured.
