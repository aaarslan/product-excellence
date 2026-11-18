# Story Break — independent anonymous artifact review

## Conclusion

All three implementations complete the central activity in the exercised DOM flows: choose prompts, write, save a finished story, reopen its complete text, retain unfinished work, and recover removed stories. All three preserved the supplied legacy draft and both saved stories, including prompt strings absent from their current decks. I found no destructive defect in the required preservation probes.

My pairwise judgments are **prefer B over A**, **prefer B over C**, and **tie A with C**. The preferences are modest. B makes the observed difficulty getting started more concrete to resolve: its visible first-line offer becomes editable text, puts focus at the end of the line, and reduces the prompt area to a compact reminder. A and C also provide useful starting guidance and complete the job; none merits a strong preference on the evidence available here.

These are functional and interaction judgments, not visual ratings. Actual browser execution was unavailable under the specified restrictions. Direct-from-disk behavior, rendered laptop and 390px layouts, and complete keyboard/accessibility behavior remain unverified. A DOM interpreter is not evidence that those acceptance conditions have passed.

## Scope and method

I read the supplied TASK.md, EVIDENCE.md, the Story Break portion of RUBRIC.md, sample-storage.json, and the three anonymous index.html files. I inspected implementation before any optional explanations; no explanations were needed or read. I did not inspect identities, unrelated directories, or agent instructions, modify candidates, use browser workarounds, or perform external actions.

The independent harness is `review1/checks.cjs`; detailed output is `review1/results.json`. It executes the candidates' unchanged inline scripts with jsdom. Each scenario starts from separate storage. Reload tests instantiate a fresh DOM with the prior localStorage contents. I supplied an artificial HTTPS origin to make jsdom localStorage usable; this does **not** test the browser's file-URL storage behavior. Scrolling calls were no-ops, a controlled clock exercised timer expiry, and one run set `innerWidth` to 390. jsdom does not calculate the responsive layout or execute native keyboard navigation.

Programmatic `.click()` and input events demonstrate event-handler/state behavior, not mouse hit areas, native keyboard activation, or whether a control is visible in the viewport. Focus assertions test explicit DOM focus changes only. The harness's successful assertions are not a checkbox score or a claim of complete acceptance.

## Acceptance outcomes

| Acceptance condition | A | B | C | Evidence and boundary |
|---|---|---|---|---|
| Single self-contained HTML with no dependencies or fetched assets | Pass, source inspection | Pass, source inspection | Pass, source inspection | CSS and JavaScript are inline; decorative artwork is inline; fonts are local families; no account, server, microphone, or tracking calls were found. |
| Opens directly from disk and works offline in the target browser | Unverified | Unverified | Unverified | No actual file-URL browser run was possible. Self-containment supports feasibility but does not establish execution or localStorage behavior. |
| Use character, place, and complication, write, retain draft, save, reopen full story | Pass, DOM | Pass, DOM | Pass, DOM | Wrote four sentences, saved, confirmed complete reading text, searched for a word inside the body, reopened, then repeated after a fresh DOM load. |
| Change only the place with existing writing | Pass, DOM | Pass, DOM | Pass, DOM | Place changed; character, complication, and exact written sentence stayed unchanged and the draft persisted. B's cards were reopened through its provided control first. |
| Existing draft and saved stories stay readable, including obsolete prompt strings | Pass, fixture and DOM | Pass, fixture and DOM | Pass, fixture and DOM | Dragon draft, full fox and moonlight texts, paragraphs, punctuation, and all old prompts survived. Saving the continued dragon draft left both original saved-story objects intact. |
| New story/opening another preserves meaningful draft text | Pass, DOM | Pass, DOM | Pass, DOM | Reading another story left the active draft intact. Starting fresh archived it; its exact text could be resumed. Editing another finished story also preserved and allowed recovery of the prior draft. |
| Removal is safe/recoverable | Pass, DOM | Pass, DOM | Pass, DOM | Removed the fox story, reloaded, restored it through each app's recovery UI, and read its original complete text. The dragon draft was unchanged. |
| Writing without mandatory countdown; expiry cannot destroy/block work | Pass, DOM | Pass, DOM | Pass, DOM | No interval ran by default. After opting in and advancing beyond expiry, text remained editable and subsequent input still persisted. |
| Practical keyboard operation | Partial | Partial | Partial | Core inputs have labels; actions are native buttons/details; focus styles are authored; finish explicitly focused the reader heading. Full Tab/Shift-Tab traversal, activation, focus visibility, and assistive-technology behavior were not verified. |
| Practical at 390 CSS pixels | Unverified | Unverified | Unverified | All have narrow-width CSS, and event flows ran with `innerWidth=390`. Actual wrapping, overflow, text size/readability, focus outlines, and action reachability require a renderer. |

No acceptance condition is marked fail from the tested evidence. That should not be read as complete acceptance: the unverified browser and layout conditions remain open.

## Common useful improvements

Every candidate addresses the main evidence coherently. Each presents three prompts, encourages a spoken first sentence, allows individual prompt replacement, accepts a short story without imposing a word quota, and gives finished work a separate reading view. Their timers are optional. Their libraries offer titles, prompt-based identification, and full-text search rather than only dates and truncated openings.

Their preservation behavior is substantive. Starting another story does not merely warn the user and then erase the ending; it keeps the work available to resume. Opening a finished story for reading leaves the working draft in place. Removed finished stories remain recoverable after a reload. These are the practical gains that carry the most weight in this comparison.

None requires setup, accounts, selecting a role, or configuring a session before writing. No candidate introduces scores, prizes, generated prose services, or social features. A title remains optional. The DOM tests found no runtime exceptions in the exercised paths.

## A

### What works

A gives a direct spoken cue incorporating the current character and place: “Why is [character] at [place]?” The user can answer in their own words and type immediately. The separate character/place/twist controls preserve the other cards, and **Undo change** restores the exact prior trio without touching the writing. I verified that reversal after replacing a character.

The shelf combines active/parked drafts and finished stories, with clear “In progress · resume” and “Ready to read” labels. A whole story tile is a button, so opening and removal do not compete on that tile. Removal is offered from the reading view, followed by immediate undo and a persistent Recently removed area. The fixture and reload checks confirm that this is actual preservation, not only reassuring copy.

### Best moment

**Finish & read aloud** turns the four-sentence text into its complete reading copy in one action, automatically supplying a character-based title when needed. The reader heading receives focus. This directly resolves the family's earlier tendency to read the cramped editor as though the story were still unfinished.

### Friction

The preparation area remains expanded after writing begins. A offers no equivalent of B's compact prompt reminder, so the three cards, spoken question, and writing area remain in the same document structure throughout a session. That is a modest ongoing attention/scroll burden in principle; its actual size on a laptop or narrow screen is unverified. A also does not provide an insertable first line for someone who wants help transferring the spoken idea to the page.

## B

### What works

B makes the first move unusually explicit: “First, say a sentence out loud,” a character/place line ending in “because…,” and **Start with this line**. That action inserts the unfinished opening, focuses the text area at its end, and switches the prompt display to a compact summary. **I have my own beginning** uses the same focused writing transition without inserting text. The supplied complication remains available in the writing help, connecting the three prompts to a story progression rather than leaving them as a decorative selection exercise.

This is a meaningful response to the observed 40-second hesitation. It gives an immediately executable next step while keeping the writer responsible for the reason and the continuation. The improvement is evidenced by the implemented focus, text, and phase changes; its effectiveness with the actual children has not been studied.

B also provides exact prompt undo, recoverable unfinished work, and a distinct reading page. Its shelf distinguishes finished, in-progress, and removed items; the search checks found a story by a word inside its full text. A removed story can be opened and read before restoring it.

### Best moment

**Start with this line → the caret after “because ”** is the strongest observed transition. A stuck writer receives a partial sentence to complete; the cards reduce to a reminder and the next story beats remain nearby in the document. This connects choosing, beginning, and continuing with a single action.

### Friction

Once B has compacted the prompts, changing the place needs an extra **See cards** step before the otherwise equivalent individual swap. **Back to my page** restores the compact phase. The cards are not gone and the writing is preserved, but people who frequently revise prompts pay a small extra interaction cost. Its shelf tabs also require choosing **In progress** to find a parked draft, whereas A and C can show drafts alongside other kept work.

## C

### What works

C tells the family to say a sentence together and then put it on the page. Additional support is optional: **Find a first line**, **Make something happen**, and **Bring it home** disclose more help. The first-line helper can insert its offered opening, and the button changes its label to describe appending when there is already text. This avoids making everyone use a template while still offering one.

The “Starting another story keeps this one on your shelf” explanation appears before the new-story action. The implementation follows that promise: it saves unfinished work with draft status, and its shelf labels that work “Still unfolding · Draft” with **Continue story**. Finished stories open a reading view. Existing legacy stories without the added status field remain readable as finished work.

### Best moment

**Start another story → the previous text remains available as a draft** makes recovery part of ordinary use rather than an emergency procedure. The wording states what will happen before the action, and the exact-text recovery probe confirms it. This directly answers the accidentally erased ending in the evidence.

### Friction

An individual card swap is immediate and has no prompt undo. The probe confirmed the old character was replaced and no reversal control was available. A and B restore the exact old trio in one action. C confirms a whole-trio shuffle when writing exists, but that confirmation does not recover a regretted individual swap. This makes trying alternatives less forgiving. Its insertable opening is also behind a closed help disclosure, which may require a stuck first-time writer to discover it.

## Pairwise judgments

| Pair | Judgment | Concrete reason and counterweight |
|---|---|---|
| A vs B | **Prefer B** | Preservation, saving, reading, and search succeeded in both. B additionally turns the visible opening into focused editable text and compacts preparation after beginning. A offers a useful spoken question but no equivalent transfer-to-page action. This is a small advantage on the observed “what do I do first?” obstacle. A's always-visible individual swaps are quicker to revisit. |
| A vs C | **Tie** | Both provide a coherent direct writing flow and preserve work. A offers a visible prompt-specific question and exact prompt undo. C offers an optional insertable opening and explains safe new-story behavior before the action. Those are useful differences, but neither establishes materially better overall success here; browser layout and real family response are unknown. |
| B vs C | **Prefer B** | B's beginning-to-editor transition is visible in the main flow; C's insertable opening requires opening a helper disclosure. B also provides exact undo for individual prompt exploration, where C offers none. C's lighter help disclosures and clear safe-new-story explanation are credible counterweights, but B more directly resolves the demonstrated initial hesitation. |

No strong preference is justified: the most consequential completion and preservation scenarios succeeded across all three. These judgments do not rank visual taste, implementation length, feature count, or inferred version order.

## Limitations and open checks

- No rendered laptop or 390px screenshot was available. Typography, contrast, target size, crowding, horizontal overflow, and visible focus are unverified.
- The 390px run tested the same scripts with a width value; it did not exercise CSS media-query layout. It must not be described as responsive-browser verification.
- Real keyboard-only traversal and screen-reader output were not exercised. Native element semantics and explicit focus calls are encouraging source evidence, not a completed accessibility audit.
- No direct file-URL browser run, true offline session, download interaction, native dialog interaction, print preview, or older-laptop performance measurement was performed.
- Tests covered the supplied valid legacy snapshot and ordinary storage. Malformed unrelated storage, quota exhaustion, private-mode policy, simultaneous tabs, interrupted multi-key writes, and long-term large libraries were not evaluated.
- The starting and burden judgments come from artifact inspection and a judge walkthrough. This was not a child usability study, and it does not establish either child's preference.

The next evidence most likely to change these judgments would be a real file-URL browser run covering the required keyboard flow and 390px layout, followed by observing whether the family uses or bypasses B's starter transition.
