# Independent blind review: Night Shift, Case 1

## Decision

**A preferred to B; A preferred to C; B preferred to C. Confidence: moderate for each comparison.** These are preferences among three assessable **Pass** deliverables, not a finding that the other prototypes fail the task.

All three provide a useful shared visit on arrival, implement their controls, use the actual programme, and calculate plausible schedules. A earns the narrow preference because it combines a ready-to-use route with unusually concrete explanations and replacement behavior: a visitor can abandon a stop at an entered time, keep earlier stops, and still work toward the original departure. B provides similar recovery after more manual context entry. C makes a particularly good initial choice about postcard uncertainty, but its rebuild action restarts the clock and clears progress, limiting its use once the visit is underway.

**No severe defect was found in the inspected and executed scope.** None of the comparisons is a visual or usability verdict.

## Evidence and limits

I read only the supplied Case 1 task and context, the frozen rubric, the three anonymous `index.html` artifacts, and then their `RESULT.md` notes. I inspected HTML, CSS, embedded content, and JavaScript. I did not inspect identities, repositories, other tasks, reviewers, or earlier results.

I authored and ran [check.cjs](check.cjs) using the supplied jsdom runtime. It loaded each unchanged HTML file with scripts enabled and no external resource loading. The harness dispatched DOM clicks, changes, and submissions through adapters for each design. Its schedule checks used an independent transcription of the supplied activity facts, rather than trusting a candidate's own assertions.

Executed coverage:

- All **216 A**, **96 B**, and **150 C** fresh combinations of offered visit length, both interests, and ground-floor restriction: **462 combinations**, with no detected schedule, activity-duration, closing-time, inter-room movement, or access violation.
- A and B additionally met their own stated return/exit allowance in those combinations. C schedules the end of the final activity; I did not impose an unstated return-to-desk requirement on it.
- Seven matched intention probes per variant, including quiet and step-free, motion/demonstration plus making, repair/stories with limited time, and stories with a ground-floor restriction. The designs expose different interests, so these are comparable intentions, not identical promises.
- Full first-room recovery at 18:30 and delayed recovery at 18:40 in A and B; a ten-minute postcard wait with earlier activity history; invalid time rejection; A undo; B visit-view DOM state and generated copy text; C visited marks, removal, restoration, and its postcard fallback.
- Six programme activities in each rendered DOM; no external asset references, CSS imports, network-fetch mechanisms, or jsdom script errors found in the inspected artifacts.

The full observations are in [results.json](results.json). Complete fresh-choice observations are in [choices-A.json](choices-A.json), [choices-B.json](choices-B.json), and [choices-C.json](choices-C.json). A prefix-preservation comparison was corrected to compare activity identities and times, rather than whole text: the earlier-stop label correctly changes during recovery. The retained schedule passed.

`scrollIntoView` was stubbed and the reduced-motion query returned false. **Rendered appearance, responsive quality, actual contrast, touch use, real keyboard behavior, focus quality, assistive-technology behavior, native modal behavior, actual clipboard access, and visitor comprehension are Unverified.** CSS, labels, focus calls, and media queries establish implementation intent only. No browser execution, escalation, or workaround was attempted. The submission notes' prior test claims were not treated as independent proof; the checks above are my own observations.

## Acceptance constraints

| Frozen constraint | A | B | C |
|---|---|---|---|
| 1. Complete standalone local HTML | **Pass.** Inline styles, script, and SVG; no required external resource found; initializes in jsdom. | **Pass.** Same; optional clipboard access has a manual-copy fallback in source and is not required for the route. | **Pass.** Same; also provides the six-activity programme in `noscript`. |
| 2. Serves an arriving visitor using the event | **Pass.** Initial shared route, named curiosities, access control, practical next step, and complete programme. | **Pass.** Initial shared route, broad interests, timed visit, practical information, and complete programme. | **Pass.** Initial shared route, separate interests, clear times, prompts, and complete programme. |
| 3. Faithful material event claims and uncertainty | **Pass.** Correct sessions, durations, access, hours, and queue/capacity caveats. Its added five-minute upstairs-room allowance is explicitly a planning assumption. | **Pass.** Correct facts and caveats. Additional upstairs-move and exit allowances are presented as estimates, not measured venue facts. | **Pass.** Correct facts and caveats. Postcard availability is explicitly conditional; no reservation or live-space claim. |
| 4. Plausible asserted visit fit | **Pass.** All 216 fresh choices passed the independent checks, including stated return to the desk. Executed delayed replacements also fit or reject invalid inputs. | **Pass.** All 96 fresh choices passed, including stated exit allowance. Executed replans preserve the deadline when current context is supplied. | **Pass.** All 150 fresh choices passed through the end of the last activity. Postcard fallbacks inspected are plausible at the stated arrival time. There is no separate exit allowance. |
| 5. Honest submitted note | **Pass.** Explicitly distinguishes source/DOM checks from unavailable visual, keyboard, and user verification. | **Pass.** Explicitly discloses the same limits and fixed/manual demo clock. | **Pass.** Explicitly discloses the same limits, fixed rebuild time, and loss of visited marks. |

The local-opening conclusion is supported by the dependency-free source and jsdom initialization, not by a real browser opening the file. No note claimed browser or user tests had occurred.

## Independent assessment: A

**Overall: Pass.** A gives a clear course of action immediately and remains useful when the first suggestion falls through. Its narrower interests also make it unusually clear which particular activity a visitor is missing and why.

| Quality dimension | Label | Consequential evidence |
|---|---|---|
| Useful visitor outcome | **Pass** | The default is Small Machines 18:30–18:50, River Listening Room 18:53–19:13, and the welcome desk around 19:16. It connects the two selected curiosities to actual stops. A 45-minute repair/quiet choice explicitly explains that the next repair talk ends at 19:15, after the 19:05 target. A ground-floor repair choice identifies stairs and no lift as the reason that curiosity is omitted. |
| Visitor effort | **Pass** | A route exists before setup. The optional preference disclosure and direct first-stop link offer a short route into the content. Replacing a chosen stop starts with that stop's proposed time, infers its floor, and retains earlier activities; visitors supply a different time only when needed. This is an observable reduction in required context entry, not a claim about actual ease of tapping or comprehension. |
| Coherence | **Pass** | The arrival, activity times, transfers, return-to-desk calculation, summaries, and compromise messages agree in the inspected states. Replacement identifies the skipped room and new start, keeps the original deadline, and offers working undo. A rejected 18:00 replacement leaves the route intact. |
| Distinctiveness and delight | **Pass** | The useful character comes from individual ways into the rooms: a question about print blocks, a detail to point out to a companion, and accessible descriptions of the wooden animals and river sounds. These help a non-specialist engage rather than merely read an activity name. No credit is assigned to its decorative styling. |
| Tradeoffs and boundaries | **Partial** | All uncertainty is disclosed, but an important initial ordering is fragile. The 90-minute machines/postcard route puts postcard making before the 19:15 demonstration, leaving only one minute beyond the estimated room transfer for a queue. The recovery is good; the initial route nevertheless makes visitors manage an avoidable dependency between uncertain seating and a fixed start. |

**Best moment.** In the 90-minute machines/postcard route, I entered 18:56 after waiting ten minutes at Make a Postcard. A retained Printing Floor at 18:23–18:43, removed the postcard activity, sent the visitors to the 19:15 Small Machines session, and calculated a return around 19:38 against their 19:50 target. It turned a blocked plan into a concrete next action without making the visitor reconstruct what they had already done. The earlier activity's identity and times were preserved; its new “earlier” label was appropriate.

**Material weakness.** Its 90-minute initial sequence is Printing Floor 18:23–18:43, postcard 18:46–19:11, Small Machines 19:15–19:35. After a three-minute move, only one minute remains before the demonstration. A queue forces a new decision despite the generous overall visit length. The visible free-seat condition prevents this from being a false guarantee, but a less vulnerable initial order would better preserve both people's intended activities.

A also cannot fit its exact Small Machines plus postcard choice into 60 minutes while retaining its own return walk. It correctly says so, then offers Machines plus Printing Floor. This is honest, but a visitor who strongly wants to make something must revise their choices or time; the alternative is not resolved in the same message.

## Independent assessment: B

**Overall: Pass.** B provides a sound shared visit and a functioning way to plan again from a later time. Its broad interests can produce an agreeable alternative without requiring the visitors to know which studio they want.

| Quality dimension | Label | Consequential evidence |
|---|---|---|
| Useful visitor outcome | **Pass** | The default matches A's two activities and 19:16 exit estimate. For 60 minutes with watching and making, B chooses Printing Floor 18:23–18:43 and postcard 18:46–19:11, leaving six minutes after the exit allowance. That is a useful two-person compromise within the meanings of its own interest choices. |
| Visitor effort | **Partial** | Arrival defaults are usable. Mid-visit replacement requires more reconstruction: its room button preselects the omitted room, but initially fills in 18:20 and ground floor, even when the visitor is planning to move on later. Visitors must supply the current time/floor and tick earlier rooms themselves. This is clearly requested, not disguised as live detection, but shifts work back to the person facing a full room. |
| Coherence | **Pass** | The departure remains fixed across the executed replans, while choosing a new visit length deliberately changes it. Excluded rooms stay excluded; invalid time at the departure is rejected. Generated route text contains the schedule, access, uncertainty, and practical facts. The visit-view class and return-to-edit control are wired; its actual rendered usefulness is unverified. |
| Distinctiveness and delight | **Pass** | Separate broad preferences and explicit “Your pick”/“Their pick” labels make a shared decision concrete. In the watching/making case, the press can satisfy one person while the postcard satisfies the other, avoiding a requirement to learn the programme first. The venue-specific activity descriptions support that choice. |
| Tradeoffs and boundaries | **Partial** | It honestly accounts for room uncertainty and provides a current-time route when the visitor supplies context. However, the same 90-minute press/postcard/machines sequence as A exposes the 19:15 demonstration to an unknown postcard wait. It also suggests more time or the programme generically when stairs prevent a stories choice, rather than directly explaining that the story-led options are upstairs. |

**Best moment.** The 60-minute watching/making result has a sensible interpretation of both interests: watch the press make a river print, then make a postcard, conditionally finishing activities at 19:11 and allowing three minutes out. It produces a viable shared visit without requiring either person to choose an activity name. The copy-text implementation also yields a useful portable schedule, although real clipboard interaction was not tested.

**Material weakness.** Context is not carried from a room's replacement button into the replan time, location, or completed-room selections. In the postcard queue probe I had to enter 18:56 and explicitly exclude the already-completed Printing Floor. The resulting future route was correct, but A obtained that same remaining Small Machines visit while preserving the earlier stop automatically. B's generic replan mechanism has value; its additional visitor work is consequential in the arrival/event setting.

## Independent assessment: C

**Overall: Pass.** C has a coherent and worthwhile arrival mechanism. Its queue handling is especially thoughtful, and the core route is genuinely calculated. Its explicit fixed-time rebuilding is a narrower capability than the surrounding visit-progress interface suggests.

| Quality dimension | Label | Consequential evidence |
|---|---|---|
| Useful visitor outcome | **Pass** | The default two-person route reaches the same activities as A and B and ends the last activity at 19:13. Individual fit labels, meaningful prompts, conditional postcard times, and fallback text provide more than programme transcription. |
| Visitor effort | **Partial** | A useful route is available immediately and pending choice changes are identified before update. At a full demonstration after arrival, however, the visitor cannot use “Plan without this” to calculate their remaining visit; it returns a new 18:20-based plan. Working out a later schedule is left to the visitor. The postcard-specific fallback avoids this burden for that particular case. |
| Coherence | **Partial** | “Mark visited” works, but rebuilding clears those marks and can recommend an already-started visit time. In the executed test, removing Small Machines produced Printing Floor at 18:23 even though the relevant full-room event is at 18:30. The footnote and announcement explicitly disclose restarting at 18:20, so this is a limitation of the workflow rather than a hidden claim of current-time recovery. |
| Distinctiveness and delight | **Pass** | The question about the stubborn wooden dog, noticing the second print colour, and finding a trace of a former mill worker give visitors practical ways to become curious. The postcard fallback also creates a concrete moment of reassurance, tied to actual rooms and times. |
| Tradeoffs and boundaries | **Pass** | Always placing postcard making last contains queue risk without requiring a general replanning engine. For the 90-minute motion/making route, the fallback explicitly calculates a different final stop if the seat is unavailable. Access and live-availability limits are honest. The final-activity finish omits an exit allowance; this is a less conservative boundary, but not a violation of an explicit return-to-desk promise. |

**Best moment.** The 90-minute motion/making route places Small Machines at 18:30–18:50, Printing Floor at 18:53–19:13, and postcard making at 19:16–19:41 if seated. At the postcard stop it offers River Listening Room instead: three minutes to move, fifteen minutes there, finishing around 19:34. The queue cannot spoil an earlier timed event. This is a useful improvement in outcome, not merely another control.

**Material weakness.** The implemented removal control cannot recover an ongoing visit. After a visited mark, removing Small Machines clears progress and proposes a visit from the original demo time. This is disclosed, and does not invalidate the arrival plan, but a visitor encountering a full room must manually translate the new plan into their actual remaining time. The progress controls make that boundary particularly relevant.

C's 60-minute motion/making route also ends postcard making at 19:18 and calls the remaining two minutes spare. It visibly warns that this is a close, queue-dependent fit. That is plausible to the end of the activity, but gives less departure margin than A or B's exit-inclusive schedules.

## Matched-probe interpretation

Some superficially different outputs are legitimate tradeoffs, not defects:

- **Quiet and step-free, 45 minutes:** all three select Printing Floor 18:23–18:43 followed by River Listening Room 18:46–19:01. The mechanical clatter is disclosed. Their “quiet” choices mean including a quiet stop, not avoiding all noisy rooms. Visitors seeking an entirely quiet visit must remove the press or consult the programme. This is a shared limitation, not a relative differentiator or a hidden quiet-only requirement.
- **Repair/stories and quiet, 60 minutes:** A and C offer River Listening Room followed by the 18:45–19:15 repair talk. B offers Archive Drawers before that talk; the archive is both quiet and story-related under B's broader choices. Both are credible interpretations. A/B allow the five-minute return downstairs; C ends at the talk and has five minutes before the nominal end.
- **Ground-floor stories:** no prototype recommends an upstairs activity when the restriction is on. A explicitly names the omitted activity and the no-lift conflict. C explains that both story-led options require stairs when both people select stories. B's explanation is more generic; it does not invent a ground-floor story talk.
- **Upstairs sequence:** A and B use a disclosed five-minute planning allowance between the two upstairs rooms. C avoids consecutive upstairs rooms entirely. The notes do not provide a measured upstairs-to-upstairs travel time. Neither a declared conservative allowance nor a narrower planner deserves an automatic factual failure.

## Pairwise preferences

### A versus B: A preferred — moderate confidence

A and B deliver essentially the same useful default and both keep their scheduled promises in the tests. A has the stronger combination of **specific decision explanation and lower recovery burden**. It explains whether a named desired activity is missing because of stairs or a finishing time, and replacing a blocked stop retains its time/floor context and earlier activity history. B asks the visitor to supply that context manually.

B has a credible countervailing advantage: its broader preferences support an agreeable watching/making route in 60 minutes, and its generated copy text can carry the plan away. These differences keep the preference narrow. A is preferred for getting a visitor from an interrupted suggestion to a trustworthy next action with less reconstruction, not for its control count or styling.

### A versus C: A preferred — moderate confidence

Both provide a useful shared arrival plan and mill-specific ways to engage. C has the better initial handling of postcard risk: its uncertain final stop cannot disrupt an earlier demonstration. A's broader advantage is that **the visit remains calculable after an interruption at any stop**, including after waiting. It preserves completed portions and the original deadline instead of restarting at 18:20.

The compromise is meaningful: A's 90-minute initial postcard order creates a dependency that C avoids. I still prefer A for its combination of clear initial guidance, precise omissions, and actual continuation when the proposed visit changes. C remains a credible, more narrowly scoped arrival guide.

### B versus C: B preferred — moderate confidence

B is more useful once a room turns out to be full or a visitor decides to change course. With entered current time, floor, and exclusions, it calculates a remaining visit and protects departure; C's rebuild cannot do that. B also distinguishes activity end from the time allowed to head out, which makes short visits easier to assess.

C's advantage is proactive risk containment and a low-effort written fallback at postcard making. That reduces the need for some recovery and is preferable to B's queue-before-demonstration order in the 90-minute probe. B wins narrowly because its recovery applies to the other uncertain room and later changes as well. This is an outcome-and-burden preference, not credit for having a dialog, copy button, or more features.

## What remains unverified

All three need actual browser review on a phone and laptop, real keyboard and assistive-technology checks, and observation of visitors trying to choose and follow a visit. Those observations could change the burden and coherence judgments. In particular, this review does not establish that anyone notices a caveat, understands a reset, can comfortably operate a time field, or sees the first useful action without difficulty.

Within the permitted evidence, A offers the strongest complete response to a shared arrival and a disrupted plan; B is close; C makes the best individual scheduling tradeoff around postcard queues but has a narrower continuing-use boundary.
