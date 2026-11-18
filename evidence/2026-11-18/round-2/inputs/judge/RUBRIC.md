# Frozen judging rubric

This rubric is fixed before any candidate skill or candidate response is inspected. Use the same tasks, facts, criteria, and evidence limits for every candidate. Do not rewrite criteria to reward an unexpected feature or penalize an unfamiliar but credible mechanism.

## What is being compared

Judge the delivered experience or recommendation, not the candidate's description of its intentions. The central question is whether the work creates a useful, coherent response to the actual situation, with proportionate effort. A distinctive mechanism can earn credit when its distinction improves the outcome. Branding, fluent prose, number of features, amount of code, and the number of named product principles do not independently earn credit.

Candidates may choose genuinely different mechanisms. There is no required planner, questionnaire, filter, itinerary, booking format, appointment length, or instructional model. A restrained result can outperform an elaborate one. Do not infer that a preferred design framework was used from its vocabulary.

## Evidence and verification

Inspect each delivered file or answer. For Case 1, inspect HTML, CSS, JavaScript, embedded content, and any available scripted DOM results. Scripted checks can establish limited facts such as whether controls are wired, whether state changes alter content, whether required event information exists, or whether a selected path violates the supplied schedule. Report exactly what was inspected or executed.

Browser execution is unavailable. **Rendered appearance, real keyboard behavior, responsive layout quality, contrast as rendered, touch usability, and actual visitor comprehension remain unverified.** Source code suggesting these properties is evidence of intent, not proof. Do not claim a visual or usability winner. This limit does not prevent judging factual correctness, an implemented decision mechanism, task fit, information coherence, burden, or other observable differences.

If the chosen design has little or no stateful behavior, do not require JavaScript merely to manufacture an interaction. Determine whether its organization or editorial mechanism actually helps someone make a visit, or merely reproduces a programme.

For Case 2, the recommendation itself is the artifact. Arithmetic, factual fidelity, stated assumptions, ownership, and internal consistency can be checked. Demand, volunteer reliability, untested transfer methods, and actual service success cannot be treated as verified.

## Judgment vocabulary

Use these labels for each acceptance constraint and each quality dimension:

- **Pass:** The available evidence supports meeting the requirement or delivering meaningful value on the dimension. Explain the consequential evidence.
- **Partial:** There is useful progress, but an identifiable gap limits the outcome. Explain who would experience the gap and what it prevents.
- **Fail:** The requirement is materially violated, the mechanism does not address the problem, or a contradiction undermines the claimed result.
- **Unverified:** The available evidence cannot establish the claim. State the missing observation. Do not turn missing browser access into either a pass or a fail.

Then give an overall **Pass / Partial / Fail** for the assessable deliverable, with material unverified dimensions listed separately. Use an overall **Unverified** only if the core artifact or enough evidence to evaluate its mechanism is missing. “Pass” does not mean that unobserved usability has been validated. A response may fail a formal constraint, such as word count, while still showing useful product judgment; report both rather than silently treating them as the same issue.

## Case 1: Night Shift prototype

### Acceptance constraints

1. A complete, standalone HTML deliverable exists, with its required styles, scripts, and assets embedded. It is intended to open locally and does not depend on network access, a backend, package installation, or other files. Optional outbound links must not be essential to the experience.
2. It addresses a visitor arriving at the mill, using the supplied event as the substantive content. A generic app shell, product pitch, or implementation plan is insufficient.
3. Material claims are faithful to the notes: demonstration times and durations, opening hours, ground-floor versus stairs-only access, unknown queues/capacity, and no reservations or live availability. Added framing or descriptive copy is allowed; invented operational facts presented as real are not.
4. Any implemented guidance that asserts a visit fits a duration must account plausibly for its own timed events and movement. Approximate suggestions may be labeled approximate. Do not demand a scheduling engine when the design makes no such promise.
5. The submitted note must not claim browser, keyboard, or user testing that did not occur. A missing note is a minor completeness issue, not a substitute for judging the artifact.

### Quality dimensions

| Dimension | Strong evidence | Material weakness |
|---|---|---|
| Useful visitor outcome | A visitor can understand a worthwhile course of action for their available time and interests, using the chosen mechanism. The artifact resolves some of the uncertainty that otherwise sends them to the desk. | The page mainly restyles the source list; the user still has to reconstruct timings, suitability, or a sensible next move. Content or controls promise guidance that is absent. |
| Visitor effort | Content, defaults, and interaction reduce work in the arrival situation. Optional detail supports a decision without making every visitor process everything. | Choosing a short visit requires unnecessary setup, repeated inputs, extensive reading, or deciphering the design's internal terminology. |
| Coherence | The central idea, information hierarchy, wording, state, and next actions support the same purpose. Guidance agrees with the underlying facts and with itself. | Competing purposes, dead ends, stale summaries, inconsistent facts, or arbitrary steps undermine trust or understanding. |
| Distinctiveness and delight | Specific mill content or a thoughtful interaction produces a useful moment of recognition, confidence, discovery, or shared choice. Explain the benefit visible in the artifact. | Ornament or a memorable name is offered as the main value. An unusual interaction adds friction or obscures essential facts. |
| Tradeoffs and boundaries | The prototype's scope is sensible for a small offline build; uncertain waits, stairs, and timed starts are handled honestly where relevant to its claims. | Scope creates brittle promises, inaccessible recommendations, simulated certainty, or unnecessary complexity. A limitation note excuses a broken central purpose. |

Comparison probes may include a short, quiet, step-free visit; a pair who want a live demonstration and something to make; or a visitor deciding whether an upstairs talk is worth their remaining time. These are probes of the chosen mechanism, not hidden requirements for particular inputs, buttons, itineraries, or universal coverage. Judge meaningful usefulness in the stated audience, not completion of a secret feature list.

An assessable overall pass requires a coherent visitor-serving mechanism with meaningful value beyond transcription, no critical offline dependency, and no material misleading claim in its central guidance. A partial result offers value but leaves a major decision or implementation gap. A fail is unusable for the central purpose, absent, fundamentally dependent on unavailable services, or materially misleading.

## Case 2: photo-scanning pilot

### Acceptance constraints

1. Give one identifiable recommendation within 650 words, counting the entire response. A comparison can support the choice, but an unranked menu is not a decision.
2. Remain within the six-week opportunity and given resource constraints, or explicitly make a proposed exception conditional on obtaining the missing resource. Do not silently assume new staff, recurring funding, a second confirmed volunteer, evening availability, or a working transfer method.
3. Preserve the distinction between enquiries, stated interest, attendance, observed throughput, and demonstrated independent ability. These notes do not establish reliable demand or a known self-service capacity.
4. Address the material completion and handoff problem: scanning alone has not produced a useful outcome if the participant leaves without usable copies. An untested solution may be proposed, but must remain a test or condition until confirmed.
5. Do not claim that any booking, purchase, outreach, technical test, or external action occurred.

### Quality dimensions

| Dimension | Strong evidence | Material weakness |
|---|---|---|
| Useful service outcome | The chosen offer has a clear beneficiary and a credible connection to photographs people can take away and use. Scope matches what the service can actually deliver. | The proposal mostly generates awareness, scans files without completing the participant's goal, or promises an archive-scale outcome unsupported by the resources. |
| Participant and operator effort | Participant preparation and support are realistic; administration, setup, delivery, and closing work have plausible owners and fit the available people. Rough arithmetic is consistent if used. | Work is shifted invisibly to residents or desk staff; an ideal throughput estimate is mistaken for appointment capacity; exceptions consume nonexistent time. |
| Coherence and decision quality | The offer, audience, delivery approach, resource use, and continuation decision form one understandable pilot. Evidence is used selectively and accurately. | The recommendation contains incompatible promises, several undeclared pilots, or an ambition disconnected from its operating plan. |
| Distinctiveness and care | Thoughtful service choices make an emotionally meaningful or confusing task easier to complete. Small choices may be valuable if their effect is concrete. | Naming, promotional language, or novelty substitutes for reliable completion. No bonus is due merely for an original format. |
| Tradeoffs and learning | The recommendation makes a defensible choice under mixed evidence, acknowledges its principal downside, and resolves or contains the important feasibility uncertainty before relying on it. A continuation signal measures something consequential. | Uncertainty disappears through confident language, the pilot cannot expose its critical assumption, or success is defined only as registrations or scanned-image counts irrespective of participant outcome. |

Several mechanisms can succeed: hosted scanning, coached participation, a narrowly supported self-service trial, a different scope, or a conditional delay with a specific preflight decision. These examples are not preferred answers. Do not require a particular number of participants, appointments, USB drives, image resolution, survey, fee, or success percentage. A hold recommendation must specify the concrete uncertainty and a proportionate next decision; generic caution alone does not use the opportunity.

An overall pass requires one workable, evidence-aware recommendation with a credible handoff and an honest plan for the principal uncertainty. A partial result has a defensible idea but leaves a material operating, feasibility, or learning gap. A fail requires resources known to be unavailable, fails to make a choice, ignores a central completion problem, or substitutes unsupported certainty for a credible plan.

## Pairwise preference, including ties

First assess each candidate independently. Then record **A preferred / B preferred / Tie / Insufficient evidence**, with confidence and the two or three differences that matter most.

Prioritize success at the actual user outcome, then the participant/operator burden required to obtain it, and coherence. Distinctiveness, delight, and polish matter when they improve a relevant outcome. A simpler deliverable may win through equal value at lower burden; a richer one may win when the added complexity earns its place. Do not count features or average away a failure of the central mechanism.

Use **Tie** when both create comparable value, when their credible advantages balance, or when only inconsequential prose or decorative differences remain. Use **Insufficient evidence** when missing artifacts or the unavailable observation prevent a responsible preference on the consequential difference. If visible product differences support a preference, unavailable visual testing alone does not force a tie. Never speculate that one implementation would look or feel better in a browser.

The final comparison should state what the preferred work helps a person accomplish, why the difference matters, the relevant cost or compromise, and what is still unverified. Do not reward the judge's favored mechanism merely for resembling it.
