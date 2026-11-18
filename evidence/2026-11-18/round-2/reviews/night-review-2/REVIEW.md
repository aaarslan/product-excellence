# Independent blind review 2 — Night Shift

## Decision

**A: Pass. B: Pass, with a bounded scheduling gap in its late empty state. C: Partial.**

**Pairwise: A–B is a tie; A is preferred to C; B is preferred to C.** The tie reflects different consequential advantages. B gives a more successful initial shared choice for a 60-minute watching-and-making visit. A gives more precise control over a particular activity and a substantially easier handoff when the visitor has reached a stop and needs another plan. Their common default is equally useful. C has the strongest queue-aware ordering, but its finish-time boundary and restart-only route changes leave more work to the visitor.

These are judgments of the assessable mechanism, facts, state and scheduling. **Rendered appearance, contrast as rendered, responsive layout quality, touch usability, real keyboard behavior, assistive-technology behavior and actual visitor comprehension are unverified for all three.** There is no visual or usability winner in this review.

## Evidence boundary and method

I read only the supplied task, venue context and frozen rubric; the complete `index.html` files for A, B and C; and each corresponding `RESULT.md`, after inspecting the artifacts. I did not inspect candidate identities, other tasks, other reviewers, repositories or surrounding directories. The variants were not changed.

I ran each artifact's inline JavaScript in the permitted local jsdom runtime. The harness stubbed `scrollIntoView` and `matchMedia`; those stubs establish no scrolling, motion or browser behavior. I exercised actual DOM controls and event handlers, then inspected state and generated content. B's dialog checks concern its jsdom/fallback state, not a real modal interaction. I inspected its generated copy text; I did not verify a real system clipboard.

The initial scheduling audit covered all available duration/pair/access combinations: 216 for A, 96 for B and 150 for C. The checks covered fixed starts, activity durations, closing times, planned transfers, ground-floor restrictions, and stated scheduling horizons. A and B also passed the initial-route checks for their explicit departure/return allowances. C's last-activity times passed; the lack of an exit allowance is assessed separately below. No script errors appeared in these executions. Source inspection and initial DOM inspection found no essential external resources; initial generated IDs were unique.

Focused checks covered a short quiet ground-floor visit, watching plus making, upstairs stories, delayed postcard recovery, invalid recovery time in A, B's current-context inputs and route text, C's pending edits and visited/removal state, and the late-upstairs departure boundary. Test counts are coverage information, not a quality score.

Evidence and reproducible scripts are in this review folder:

- `checks.cjs` and `DOM_EVIDENCE.json`: initial states, full combination checks, selected routes and adaptation interactions.
- `DOM_SUMMARY.json`: compact schedule and selected-content results.
- `edges.cjs` and `EDGE_EVIDENCE.json`: late-upstairs and zero-spare finish checks.

## Understanding the mechanisms

### A — specific curiosities, immediate routes, local replacement

A starts with a usable route and makes setup optional. Its two curiosity selectors correspond to the six activities: moving things, print and paper, a quiet pause, making something, the mill's past and repair. Changing a duration, curiosity or ground-floor preference immediately builds a route from 18:20. Specific selected activities receive overwhelmingly greater weight than related alternatives. This is closer to fitting two particular wishes than to broadly interpreting an interest.

The schedule includes the initial walk, inter-room moves and return to the welcome desk. A stop's replacement control knows which room the visitor is at, asks when they are ready to leave it, keeps earlier stops, and rebuilds the remaining route against the original finish. This is a concrete adaptation mechanism, not merely a restart. A separately discloses its additional five-minute allowance between upstairs rooms.

### B — broad interests, a departure budget, portable visit view

B asks each person for one of four broad interests. Its planner can substitute different rooms that satisfy the same interest: the press and automata both satisfy watching, while archive drawers and the repair talk both satisfy stories. Controls update the suggested route immediately; the form's submit action moves to it. The initial suggestion is already present.

The route includes time to head out. Visitors can switch to a visit view or open a plain-text copy. To change a route during the visit, they supply the current time, floor, and rooms already visited or omitted. This is flexible, but a clicked stop is not used to populate the current time/floor or infer preceding completed stops.

### C — balanced interests, explicit update, postcard-last ordering

C also starts with a route. Its broader interest choices are applied through an explicit update action, with a pending-change message. It scores strong matches for both people and puts any postcard activity last. A queue therefore cannot cause a later scheduled demonstration to be missed. It often gives an immediate, timed alternative in the postcard card itself.

C's finish is the end of the final activity. It does not add time to leave the room or descend from upstairs. Its visited marks are a checklist; “Plan without this” reconstructs the entire visit from 18:20 and clears them. That boundary is disclosed in the page and delivery note, but it makes this an arrival planner with a checklist, rather than a current-time recovery tool.

## Acceptance constraints

| Constraint | A | B | C |
|---|---|---|---|
| Complete standalone offline HTML | **Pass.** Inline CSS, script and SVG; local DOM initialization succeeds without external dependencies. | **Pass.** Same; copy text has a manual path when automatic copying is unavailable. | **Pass.** Same; a static programme is also supplied in `noscript`. |
| Substantive visitor experience for this event | **Pass.** Builds a particular route, explains mismatches, offers specific next actions and all six activities. | **Pass.** Builds a shared route with a departure time, broad-interest matches and a usable text handoff. | **Pass.** Builds a shared route with room atmosphere, access, useful observation prompts and conditional queue alternatives. |
| Material fidelity to venue notes | **Pass.** Times, durations, access and queue uncertainty agree with the notes. Additional travel allowances are identified as planning assumptions. | **Pass.** Times, durations, access, first-come room space and unknown queues are preserved. Upstairs movement is described as an allowance. | **Pass.** Event facts and access agree with the notes; postcard time is conditional and no capacity or booking claim is invented. |
| Plausible timing for implemented guidance | **Pass.** Initial routes honor timed starts, transfers, closings and the return budget. Recovery from 19:19 upstairs explicitly warns that returning takes until about 19:24, past the 19:20 target. Postcard routes are honestly conditional. | **Partial.** Initial generated routes and a tested current-time replan fit their departure budgets. But replanning from upstairs at 19:19 with a 19:20 departure produces “Leaving by 19:20” and an empty-state suggestion to look around or ask the desk, without the required descent allowance or a late-return warning. | **Partial.** Stops and inter-room transfers are coherent, but the “visit” duration is only an activity horizon. In a normal 45-minute motion/stories route, Archive Drawers ends upstairs at 19:05 with “0 min spare”; a five-minute floor change remains. The 60-minute motion/making route ends at 19:18 with “2 min spare,” without an exit allowance. This is a finish/handoff gap, not an incorrect demonstration time. |
| Honest submitted testing note | **Pass.** It explicitly limits checks to source/DOM/logic and says browser, layout, keyboard and real-user verification were unavailable. | **Pass.** Same distinction; its note does not claim browser or user testing. | **Pass.** Same distinction; it also states the clock/reset and persistence limitations. |

The C finding does not impose a requirement for a sophisticated scheduler or a particular exit route. A plain distinction between “last activity ends” and “allow time to head out,” or a conservative departure allowance, would resolve the ambiguity. The current “How long have you got?” and “Your 45-minute visit” framing makes it consequential. B's gap is confined to a late recovery state; its normal initial guidance includes the return walk.

## Independent quality assessments

### A — overall Pass

| Dimension | Judgment and consequential evidence |
|---|---|
| Useful visitor outcome | **Pass.** The initial Small Machines 18:30–18:50, river 18:53–19:13 and desk return about 19:16 resolve a real arrival decision. Selecting Repair Stories for 45 minutes explicitly explains that its 19:15 end is after the 19:05 finish. A visitor can decide whether more time is worth it without reconstructing the schedule. |
| Visitor effort | **Pass.** No setup is needed to start; the paired choices are optional disclosure. Stop-specific replacement requires the ready-to-move time rather than a new list of visited rooms and a floor input. Effort rises when the chosen curiosities compete: the visitor must change a specific wish or visit length to prioritize the omitted one. |
| Coherence | **Pass.** Immediate updates, activity-specific match labels, missing-interest notices, retained earlier stops and departure accounting support a consistent purpose. In the delayed postcard check, it retained the press, moved forward from the postcard room at 19:08, and caught Small Machines at 19:15. Undo restored the previous plan. |
| Distinctiveness and delight | **Pass.** “Find one small detail to point out to your companion” in Archive Drawers gives the pair a concrete shared activity, while maker questions and listening prompts give novices an easy way into the actual content. This value comes from the activity, not the visual identity or route names. |
| Tradeoffs and boundaries | **Partial.** Constraints and uncertainty are explicit, and late-return handling is strong. However, the 90-minute moving/making route puts postcard-making at 18:46–19:11 before a 19:15 demonstration, with a three-minute move. Only one minute of a queue can be absorbed before that timed start, even though the overall route shows twelve minutes before departure. Replacement can recover, but the initial order creates avoidable fragility. |

**Best moment:** after a postcard wait, the revised instruction is grounded in the room and time the visitor supplied: leave Make a Postcard at 19:08, walk three minutes, join Small Machines at 19:15. The earlier press stop remains in the route, and the finish remains intelligible.

**Main weakness:** its specific-choice scoring can undermine the initial shared compromise. At 60 minutes, “Moving things” plus “Making something” returns Small Machines and the press, leaving out postcard-making. The omission is honest and a specific automata-plus-postcard plan cannot fit its return budget, but the outcome gives the pair two watching stops. B's broader interpretation gives the same broad watching/making goal a press-plus-postcard visit that fits. A requires the pair to revise one curiosity themselves.

### B — overall Pass

| Dimension | Judgment and consequential evidence |
|---|---|
| Useful visitor outcome | **Pass.** Broad interest matching earns its place in the 60-minute watching/making case: press 18:23–18:43, postcards 18:46–19:11, then three minutes to head out, with six minutes before the 19:20 departure. Both people get a substantive match. |
| Visitor effort | **Partial.** The initial route and immediate updates keep arrival effort low, and the generated text can carry the decision away from setup. Recovery shifts work back to the pair: clicking the second postcard stop in the 90-minute route defaults to 18:20, ground floor, and only postcard omitted. At 19:08 they must change the time and separately omit the already visited press. An upstairs action similarly needs the correct floor supplied. This is an observable input burden, not a claim about tested usability. |
| Coherence | **Pass.** Interests, timed stops, leave-by time and normal current-time replanning agree. Supplying 19:08 and the visited/omitted rooms produced a valid Small Machines 19:15–19:35 route with twelve minutes before 19:50 after exit. Generated route text retained time, floor, uncertainty and departure information. The late empty-state exception is recorded under timing and boundaries. |
| Distinctiveness and delight | **Pass.** Its shared-choice language is backed by actual substitutions that work: someone watches a river print being made while their companion gets a making activity. The “Your pick / Their pick” labels explain why the two stops belong together. Visit view and copy matter as handoff mechanisms, not as extra features to count. |
| Tradeoffs and boundaries | **Partial.** Room capacity, queues and travel assumptions are honest. The 90-minute watch/make route has the same postcard-before-19:15-demo fragility as A. Its late-upstairs empty state also preserves an unattainable departure label without the five-minute descent warning. |

**Best moment:** the initial 60-minute press-and-postcard choice. It resolves “will my partner enjoy this?” with two different experiences and a credible ordinary departure allowance, using familiar interests rather than requiring visitors to know the programme first.

**Main weakness:** the recovery form starts from planning state rather than the stop that invoked it. It can produce a correct remaining visit, but the visitor has to reconstruct current context and completed rooms. That burden is especially relevant when the visitor is already dealing with a full room or queue.

### C — overall Partial

| Dimension | Judgment and consequential evidence |
|---|---|
| Useful visitor outcome | **Pass.** The initial suggestion is as useful as the others, and broad paired interests alter real stop choices. The 90-minute motion/making route gives a demonstration, the press and a postcard. It also explains missing strong matches and supplies the full programme. |
| Visitor effort | **Partial.** The explicit update and pending-change message form a reasonable setup model. The postcard's immediate fallback reduces effort when the queue is discovered on arrival. But after visited marks exist, a general removal supplies a new 18:20 plan; using it during the actual visit requires visitors to discard old times and reconstruct what remains. |
| Coherence | **Partial.** The pending form state is clear and the checklist works, but checklist progress is not carried into route changes. In the tested 90-minute route, marking Small Machines visited and removing postcard-making yielded press 18:23, river 18:46 and Small Machines again at 19:15, with progress back to zero. This behavior is disclosed, so it is not a hidden runtime bug; it limits the connection between following a visit and changing it. |
| Distinctiveness and delight | **Pass.** Putting postcards last is a useful product decision. For the 90-minute route, a queue at the 19:16 postcard arrival has an in-place alternative: allow three minutes to the river room and fifteen minutes there, ending around 19:34. The visitor need not operate a planner to use that advice. Mill-specific prompts also give novices something concrete to notice. |
| Tradeoffs and boundaries | **Partial.** The page is honest about fixed demo time, unknown room space and queue assumptions; postcard-last ordering contains an important uncertainty. However, activity-end “spare” time can be mistaken for time remaining after a completed visit. The normal 45-minute upstairs path has no time left to descend. Explicit restart disclosure also does not make its generic route-removal control useful as current-time recovery. |

**Best moment:** its 90-minute motion/making order: Small Machines 18:30–18:50, press 18:53–19:13, postcard 19:16–19:41. An unknown postcard queue cannot invalidate a later timed demonstration, and the inline fallback is a concrete action with a plausible movement allowance.

**Main weakness:** the finish boundary is incomplete for the task's time-limited visitor. Twenty-one of the 150 initial combinations leave less time than a three-minute ground-floor exit or five-minute descent would require. Those are screening allowances, not measured exit times. The clearest case needs no precise exit assumption: a 45-minute route ends on the first floor at the end of the available 45 minutes. The state-reset behavior adds a separate handoff burden but is not, by itself, a reason to fail an arrival-focused prototype.

## Cross-cutting probe: a short, quiet, step-free visit

All three choose the clattering Printing Floor first and then only fifteen minutes in the River Listening Room for a 45-minute quiet/quiet ground-floor request. The schedule fits in each model; access and noise are disclosed. None claims that the entire visit is quiet, so this is not a factual violation or a demand for a hidden quiet-only filter.

It is still a shared weakness in the chosen recommendation: both people have expressed the same quiet interest, yet the planner spends twenty minutes on an unrequested noisy extra and shortens the quiet stay. A single longer river-room visit with a pause could serve that pair better. This is a reason to question the route-selection judgment, not to reward the number of stops produced. It does not distinguish the candidates.

## Pairwise preferences

| Pair | Preference | Confidence | Reasons that matter |
|---|---|---|---|
| A vs B | **Tie** | **Moderate** | Their identical default and sound ordinary departure budgets create comparable initial value. B better translates a broad 60-minute watching/making goal into two different satisfying experiences. A better serves someone targeting a particular talk or automata demonstration and reduces actual recovery input by retaining earlier stops, location and departure context. Neither advantage can responsibly be erased by feature count or prose quality. |
| A vs C | **A preferred** | **Moderate to high** | A completes the time promise through the return walk and can give an honest late-return result. Its stop-specific recovery continues from a supplied current time while keeping prior stops; C restarts. C's postcard-last order and immediate fallback are real advantages, and A's 60-minute specificity can omit making, but A gives the visitor a more coherent schedule-to-departure handoff. |
| B vs C | **B preferred** | **Moderate** | B's 60-minute press/postcard alternative satisfies both broad interests with an exit allowance and six minutes of slack; C's automata/postcard route ends with two activity-horizon minutes. B can turn supplied current context into a remaining plan and portable route text. C requires less interaction for its specific postcard fallback and orders the 90-minute queue risk more wisely; B's modal recovery burden and late empty-state defect prevent a stronger preference. |

The preferred tier helps a pair choose what to do, understand which interest is served, and retain a credible relationship between scheduled activity and leaving the mill. A earns its place through specificity and continuity; B through broader initial compromise and a useful handoff. Both should adopt C's queue-aware ordering. No conclusion here depends on presumed visual polish, mobile comfort or real-world comprehension.
