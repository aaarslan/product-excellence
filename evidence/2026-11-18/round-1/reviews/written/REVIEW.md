# Independent blinded review: lending cupboard and worktree command

## Scope and method

I read only the two authorized `TASK.md`/`EVIDENCE.md` pairs, the frozen `RUBRIC.md`, and the six anonymous `RESULT.md` files. I did not inspect arm identities, other directories, repositories, skill texts, or external sources. This is a review of written recommendations, not an implementation test or a field trial.

All output references below are local paths relative to `/workspace/scratch/6ecb29bfb4b0/review-pack/variants/`; input references are relative to `/workspace/scratch/6ecb29bfb4b0/review-pack/inputs/`. Line numbers refer to the supplied files. Counts use whitespace-separated words, including headings and command examples.

The frozen rubric gives priority to meaningful changes in success, comprehension, effort, recovery, or enjoyment and expressly discourages rewarding length or feature count (`judge/RUBRIC.md:7–9`). I have not totaled acceptance checks or manufactured an overall score. A proposed time allocation can pass as a written budget while its adequacy in practice remains untested.

## 1. Lending cupboard

### Acceptance outcomes

| Acceptance condition | A | B | C |
|---|---|---|---|
| At most 600 words | **Pass:** 597 | **Pass:** 586 | **Pass:** 592 |
| One recommendation for a four-week trial | **Pass** | **Pass** | **Pass** |
| Stated preparation time at most six hours | **Pass:** explicit 1+2+1+1+1-hour allocation, line 25 | **Pass:** six-hour preparation cap, line 30 | **Pass:** explicit 2+1+1+1+1-hour allocation, line 21 |
| Stated spending at most £120 | **Pass:** £40, line 25 | **Pass:** £30, line 30 | **Pass:** £20, line 21 |
| Uses only available access arrangements | **Unverified:** handover windows comply, but access for two hours of physical preparation checks is unscheduled | **Fail:** Thursday replacement explicitly runs past centre closing time | **Unverified:** handover windows comply, but access for two hours of physical preparation checks is unscheduled |
| Weekly budget at most 90 volunteer minutes, including handovers | **Pass as a budget:** 45+20+10+10+5, intake closure, line 21 | **Pass as a budget:** 45+30+15, pause commitments, line 28 | **Pass as a budget:** 45+20+10+10+5, intake closure, line 23 |
| No invented staff, second location, integrations, deposits, or universal app installation | **Pass** | **Pass** | **Pass** |
| No public personal borrowing records | **Pass:** lines 9, 23 | **Pass:** lines 7, 28 | **Pass:** lines 9, 19 |
| No fabricated demand or economics | **Pass:** limited interpretation of visible requests, lines 5, 31 | **Pass:** lines 34, 38 | **Pass:** lines 27, 31 |

**Access qualification matters.** The input says the centre closes on weekdays at 18:00 (`inputs/lending-cupboard/EVIDENCE.md:7`). The offered Thursday volunteer availability extends to 18:15, but it does not extend the building's opening hours (`EVIDENCE.md:9`). A and C explicitly use the valid overlap, 17:30–18:00. B instead says: “Thursday 17:30–18:15 is a replacement only when Saturday is unavailable” (`lending-cupboard/B/RESULT.md:26`). That is an explicit access conflict, even though the normal Saturday plan is feasible on its face.

A and C have a different, unresolved access question. A allocates “inspect both kits (two)” preparation hours (`A:25`); C allocates “two hours checking equipment” (`C:21`). Both then contemplate issuing already-checked equipment in week 1. Neither identifies when those two physical hours occur within the available cupboard sessions. The task permits six preparation hours but also says, “Only the access arrangements in the notes are available” (`inputs/lending-cupboard/TASK.md:7`). I have not assumed that the six-hour preparation allowance creates an additional two-hour cupboard opening. Nor have I declared this impossible: the preparation/access interpretation is not settled by the proposals. It is **unverified**, and it would need resolution before either first-week promise could be accepted.

B avoids that assumption by placing “Check and label up to four requested items” inside week 1's authorized session and stating, “Physical checks happen in week 1’s permitted session” (`B:21,30`). This is a real advantage in its main operating schedule, not merely more explanatory text.

### Schedule and workload audit

| Variant | Proposed service cadence | What the stated schedule actually permits |
|---|---|---|
| A | One-week loans of two items; Wednesday confirmations; returned items wait for a later booking cycle; week 4 returns only (`A:11,13,29`) | If both kits are ready before the first confirmation, at most two issues in week 1, two returns in week 2, two issues in week 3, and two returns in week 4. The four-loan ceiling is coherent. It is not eight loans or same-session guaranteed turnover. |
| B | Week 1 checks, week 2 issues, week 3 returns, week 4 recovery/review (`B:19–24`) | Up to four ten-minute issues occupy 40 of 45 Saturday minutes. Inspection or longer handovers can reduce capacity. A Thursday replacement has only 30 minutes of valid building access, so four ten-minute issues do not fit; its fallback needs both a corrected end time and capacity adjustment. |
| C | Issues on Saturdays 1 and 3; returns/checks on 2 and 4 (`C:3–5`) | Two items permit four loans. The intervening week supports confirmation after inspection. With only two handovers in a normal issue/return session, the written schedule is plausible, subject to actual check duration and preparation access. |

All three keep one reservation owner and a shared private register, use existing WhatsApp private messages, and cap administration. None requires a new technical inbox or continuous availability updates. None has demonstrated that its allocation is enough in actual use. A and C reserve 45 on-site minutes even if the fallback is only 30 minutes; that is harmless as an upper time budget, but the shorter actual handover window must still fit the work.

A accounts for existing loans and commitments during preparation and gates launch on their compatibility (`A:25`). B and C do not explicitly reconcile pre-existing commitments. The actual outstanding-loan load is unknown, so I have not assumed it is zero or treated this omission as demonstrated failure.

### A: strongest moment and principal weakness

**Strongest moment:** “Confirm only equipment already checked and physically in the cupboard. An expected return never becomes a firm booking” (`A:13`). This is paired with a definite Wednesday answer and eligibility tied to both scheduled sessions (`A:11`). It addresses the consequential resident moment: deciding whether a carpet can be cleaned before Sunday's visit. It prevents the service from reproducing unreliable promises in a new interface.

The rest of the path is coherent: contents/condition checks at both ends, a pack-up card, a private reminder, and incomplete equipment withheld (`A:15`). Its explicit £40 and 90-minute limits are modest and observable. The continue criteria—three households, successful confirmed collections, complete final returns, and every week under the cap—are operational measurements, not claims of proven demand (`A:31`).

**Principal weakness:** the two-hour physical preparation check has no authorized access slot (`A:25`). This affects the first promised loans, so it is more material than stylistic differences. A also says week 4 returns only is “avoiding obligations beyond the trial” (`A:29`). That avoids *scheduled* later returns, but cannot eliminate an overdue or unresolved item after week 4; its closure claim should be read with that limit.

### B: strongest moment and principal weakness

**Strongest moment:** its four-week operating sequence puts checks in week 1, issues in week 2, returns in week 3, and recovery in week 4 (`B:21–24`). This locates physical work inside permitted sessions and leaves a real recovery opportunity. The sample confirmation also asks the resident to “reply to accept both appointments” (`B:11`), making the resident's commitment explicit.

B handles incomplete equipment and lateness without contingent promises: “A late return triggers one private follow-up” and “Nobody receives a promise dependent on another resident returning something” (`B:15`). Its pause at the time ceiling and no-repair/procurement boundary constrain volunteer scope (`B:28,30`).

**Principal weakness:** its Thursday fallback extends beyond the 18:00 building closure (`B:26` versus input `EVIDENCE.md:7`). That can produce precisely the failed handover the pilot is intended to prevent. The issue is compounded by the four ten-minute appointments: the corrected 30-minute window cannot accommodate all four. This requires a small but substantive schedule/capacity correction before use.

### C: strongest moment and principal weakness

**Strongest moment:** the explicit alternating issue/return cadence makes the readiness promise easy to operate: “Lend on Saturdays 1 and 3; receive and check returns on Saturdays 2 and 4” (`C:3`). It explains the reduced availability as an uncertainty to test (`C:5`), rather than disguising it as full weekly availability.

C is especially candid about the end of the pilot: “An overdue after the final session remains an unresolved recovery obligation; no extra access is assumed” (`C:15`). It also withholds incomplete or late equipment from the next reservation and supplies item-specific pack-up/contents instructions (`C:13,15`).

**Principal weakness:** like A, its “two hours checking equipment” are placed in preparation without a stated access slot (`C:21`). Its public round-closed notice gives an eventual no to unconfirmed requests (`C:11`) and limits individual messaging work, but residents must understand that convention. Whether they understand and see it is untested; a public notice is not evidence that every rejected requester received a personal refusal.

### Pairwise preferences

| Pair | Preference | Evidence and material rationale |
|---|---|---|
| A vs B | **Prefer A, narrowly** | A explicitly limits the fallback to “17:30–18:00” and requires affected residents' agreement or cancellation (`A:19`). B offers 17:30–18:15 (`B:26`), contrary to the centre's 18:00 closure, and its four ten-minute handovers exceed the valid fallback window. The difference affects whether a confirmed appointment can happen. B's scheduled inspection and recovery week are genuine countervailing strengths; A's preparation access remains unverified, so this is not a strong preference or certification of full feasibility. |
| A vs C | **Tie** | Both restrict the service to two evidenced items and four possible loans, condition promises on inspected equipment already present, protect privacy, cap work, and use the correct fallback window (`A:3,13,19,21,29`; `C:3,15,19,23`). A gives individual answers and more explicit continuation thresholds; C makes cadence and residual recovery obligations clearer. Both share the unresolved preparation-access assumption. These differences do not establish an overall material advantage in likely user success. |
| B vs C | **Prefer C, narrowly** | C specifies the valid Thursday overlap and confirms affected residents can attend (`C:23`), while B's fallback is outside building access (`B:26`). C's two-item cadence also makes its shorter fallback less crowded. B has the clearer permissible inspection schedule and a recovery week; C's preparation access remains unresolved. The non-tie is specifically about a confirmed access conflict, not branding, restriction to two items, or feature count. |

These narrow preferences are sensitive to the preparation-access uncertainty. If no preparatory on-site access can be established for A/C, their first-week-ready schedule needs changing. B then has the more concrete main-session inspection plan, after correcting its Thursday fallback. No proposal deserves an unconditional “ready to run exactly as written” endorsement.

### Untested uncertainties

Actual preparation access for A/C; the kits' present location, completeness, and safe operating condition; existing commitments; duration of meaningful checks and cleaning; whether four B items can be checked in 45 minutes; real message and recovery load; resident understanding of C's public negative-answer convention; acceptance of alternate-week availability; whether Saturday or substituted Thursday access meets intended uses; and retrieval of any item still outstanding after the final session. All proposed continue/change/stop evidence is prospective. Four possible loans cannot establish broad demand or long-term reliability; all three acknowledge small-sample limits.

## 2. Worktree command

### Acceptance outcomes

| Acceptance condition | A | B | C |
|---|---|---|---|
| At most 450 words | **Pass:** 430 | **Pass:** 422 | **Pass:** 411 |
| One bounded CLI recommendation, example command, key outcomes | **Pass** | **Pass** | **Pass** |
| Preserves legacy invocation and `--repo` semantics | **Pass:** lines 20, 29 | **Pass:** lines 26, 32 | **Pass:** lines 20, 22 |
| Selected root supplies config and execution directory; forwarded arguments preserved | **Pass:** line 26 | **Pass:** line 17 | **Pass:** line 16 |
| Preserves legacy child streams and exit behavior | **Pass:** lines 20, 26, 35 | **Pass:** lines 17, 32 | **Pass:** lines 16, 22, 26 |
| No new default banner/prompt | **Pass:** opt-in only | **Pass:** opt-in only | **Pass:** opt-in only |
| No forbidden Git mutation, directory search, dependencies, config migration, or integrations proposed | **Pass** | **Pass** | **Pass** |
| Failed selection never silently executes in current checkout | **Pass:** line 27 | **Pass:** line 23 | **Pass:** line 20 |

These are passes for the specified recommendation, not evidence that code has been implemented or compatibility checks have run. All three reuse the existing executor, making a two-day change credible, but codebase complexity and implementation time were not available for inspection.

### What the common design actually improves

All three propose `wrun --pick test -- --runInBand`, list only the current repository's worktrees, show identity together with a full root path, and require an explicit row number. This lets a developer supply intent at execution time using a remembered branch without having to locate a path first, while still supporting detached HEAD. The evidence says branch names are easier to recall and paths can look alike (`inputs/worktree-command/EVIDENCE.md:16–17`), so the picker has a concrete purpose beside existing `--repo`.

All three reject stale selection, avoid a default Enter choice, use the selected worktree's `.wrun.json`, preserve task arguments, and retain the child's status including intentional exit 1. All explicitly keep legacy invocations vulnerable to wrong-terminal use unless the new mode is chosen. This is an accurate protection boundary, not a claim to infer intent automatically.

B's additional chosen-identity stderr line (`B:17`) is confined to the new opt-in mode. The input explicitly allows new opt-in syntax to define its own behavior (`inputs/worktree-command/EVIDENCE.md:9`), so this is **not** a legacy-output violation.

### A: strongest moment and principal weakness

**Strongest moment:** “Require an explicit number, even with one candidate; Enter has no default” (`worktree-command/A/RESULT.md:18`), combined with immediate identity revalidation and “never substitute another worktree or fall back to the current directory” (`A:26–27`). This creates a meaningful deliberate-selection step rather than an easily dismissed warning.

**Principal weakness:** the benefit depends on recurring opt-in adoption and one manual selection per command. A is honest about this: “The cost is one deliberate choice per run” (`A:22`) and “adoption is the unproven assumption” (`A:37`). It does not establish that developers will keep using the mode under ordinary time pressure. The proposed five-person trial and repeat-use observation address this uncertainty rather than resolve it (`A:35`).

A rechecks the branch ref for attached branches and commit identity for detached HEAD (`A:26`). It does not explicitly guard an attached branch's changed HEAD commit. Because its attached rows identify checkout by branch and root, and the requested objective is intended checkout, this is not by itself a demonstrated safety regression relative to B/C's broader commit checks.

### B: strongest moment and principal weakness

**Strongest moment:** “Selection is the commitment to run, with no additional confirmation” and the same selected root can be reused with `--repo` for subsequent commands (`B:15`). This gives the picker an understandable role alongside the established path selector without duplicating the execution model. The immediately refreshed root/branch/HEAD checks and explicit refusal to fall back support that commitment (`B:17,23`).

**Principal weakness:** ongoing adoption is still unproven. B's trial appropriately observes “whether engineers select their intended checkout and voluntarily reuse the picker” (`B:32`), but no evidence yet shows that the manual step will replace risky copied commands in daily work. Its extra chosen-identity line may aid traceability, but it does not itself prove fewer wrong-checkout runs. Its revalidation also has the ordinary concurrent-change window; unlike A and C, B does not expressly name that limit, but it does not claim atomicity.

### C: strongest moment and principal weakness

**Strongest moment:** binding selection to the exact worktree and captured identity, then refusing rename, disappearance, replacement, or changed HEAD before config loading and execution (`C:15`). It also accurately says: “Revalidation reduces the race window; it cannot make concurrent Git/filesystem changes atomic.” The explicit preservation of flags after `--` is relevant to the existing contract (`C:22`).

**Principal weakness:** “Invalid or empty selection ... produce a stderr diagnostic and exit 2” (`C:20`) makes a mistyped number or accidental Enter restart the chooser, whereas A/B allow correction in place (`A:18`; `B:21`). This is a small, concrete recovery cost. It does not compromise execution safety, and the supplied evidence does not show it is frequent or consequential enough to decide an overall preference. C also needs sustained adoption, like A/B; all five engineers completing a deliberate selection in its proposed release trial (`C:26`) cannot establish continued everyday use.

### Pairwise preferences

| Pair | Preference | Rationale |
|---|---|---|
| A vs B | **Tie** | Same user mechanism, deliberate selection, detached support, fail-closed stale selection, executor reuse, and legacy compatibility. B adds command/argument context and chosen-identity output; A gives a concrete sample and explicitly names the residual race. Neither establishes a meaningful success or effort advantage from those differences. |
| A vs C | **Tie** | Both define the intended-root and no-fallback contract adequately and name relevant checks and a five-engineer trial. A's in-place input correction is modestly easier; C's HEAD binding and explicit parsing statement are more detailed. Neither greater detail nor a small correction-path difference establishes a material overall improvement from the written evidence. |
| B vs C | **Tie** | Both use the same selection and revalidation pattern. B is somewhat more forgiving of invalid input and explicitly measures voluntary reuse; C explicitly bounds the race and makes release contingent on compatibility checks and successful selection. The evidence does not support a meaningful net difference in likely practical success. |

### Untested uncertainties

No CLI implementation, terminal session, compatibility run, or engineer trial was supplied. Unknowns include argument parsing in the actual codebase, cancellation/signal behavior, unreadable or corrupt worktree metadata, actual filesystem races, whether display information is sufficient in real repositories, menu usability with many worktrees, two-day engineering feasibility, and repeated voluntary adoption. A/C acknowledge that preflight cannot make execution atomic; B should be read with the same technical limit. No recommendation should be credited with completed tests merely because it names them.

## Result boundaries

The CLI case is three adequate written recommendations tied on substantive user benefit; it supplies no demonstrated improvement between variants. Lending has a concrete fallback-access regression in B and unresolved preparation-access assumptions in A/C. The lending preferences are narrow and explained above. No overall average or cross-case winner is inferred, and no result is claimed for scope or other cases outside this assignment.
