# Independent anonymous review: Story Break

## Decision

**A versus B: tie. A versus C: prefer A. B versus C: prefer B.** These are modest preferences, not strong preferences. All three implement the central writing, finishing, preservation, and reopening journey successfully in the exercised DOM environment. The differences supporting the two non-ties concern recoverability of prompt changes and finding the active draft. They do not establish that one page is visually better or easier for children to use.

**Overall acceptance for each artifact: partial verification.** The executable checks support the application logic. Direct-from-disk/offline execution, real keyboard use, rendered layout at laptop and 390 CSS pixels, and accessibility remain unverified. No central-path failure was observed in the checks performed.

## Scope and evidence limits

I reviewed only the supplied Story Break task, observations, baseline HTML, old storage snapshot, frozen rubric, and anonymous A/B/C HTML files. I did not read worker reports or other reviews. This report covers Story Break only; it makes no finding on the rubric's other cases or literal-scope probes.

The implementation checks use jsdom with a synthetic HTTPS origin. Each candidate received the same scenarios and seed data. Scroll methods, timer scheduling, object URLs, and dialog open/close were stubbed where necessary to execute application handlers. Timer expiry was simulated by advancing the clock and invoking its registered callback. Reload meant constructing a new DOM from the same HTML and the captured storage contents.

These are **script/DOM checks, not browser or child usability observations**. In particular:

- Synthetic `.click()` and focus checks do not prove that a person can complete the flow using a real keyboard.
- jsdom does not establish rendered size, wrapping, overflow, visible focus, reading comfort, or which controls are above the fold.
- The HTTPS storage environment does not prove `file:` origin behavior on the family's browser.
- Dialog shims do not test native modal behavior, focus trapping, or Escape handling.
- Download controls were inspected in source; a real downloaded file was not verified.

The runnable evidence is in `checks.cjs`; the recorded outcomes and static observations are in `results.json`, both beside this report.

## Acceptance outcomes

| Acceptance or required probe | A | B | C | Evidence and qualification |
| --- | --- | --- | --- | --- |
| One self-contained plain HTML/CSS/JS artifact without fetched dependencies | Pass, source inspection | Pass, source inspection | Pass, source inspection | Inline code/styles; no external resource references, CSS imports/URLs, or network-request APIs were found. |
| Opens directly from disk and works offline in a real browser | Unverified | Unverified | Unverified | No permitted browser execution. Source independence is favorable evidence, not a file-origin execution result. |
| Empty storage presents three prompts and allows starting without accounts or required configuration | Pass, DOM/source | Pass, DOM/source | Pass, DOM/source | All supplied nonempty prompts, started without an active timer, and did not preload the sample library. Beginning assistance was examined separately below. |
| Change only the place after writing a sentence | Pass, DOM | Pass, DOM | Pass, DOM | Place changed; character, complication, and exact written text stayed intact in the editor and stored draft. |
| Write, retain a draft, finish four sentences, find and reopen the complete story | Pass, DOM | Pass, DOM | Pass, DOM | A four-sentence titled story persisted, was found through search, and reopened with its complete exact text in a distinct reader. Both draft and finished story survived reconstructed reload. |
| Old draft and saved text remain readable, including prompt strings absent from the deck | Pass, DOM | Pass, DOM | Pass, DOM | The nervous-dragon draft and both supplied full stories remained intact. The umbrella repairer, shop under the moon, and leaking moonlight strings were preserved. Titles, line breaks, and text were compared directly. |
| Write without mandatory countdown; expiry preserves work and permits continued writing | Pass, simulated DOM | Pass, simulated DOM | Pass, simulated DOM | None started a clock automatically. After simulated expiry, the text remained editable, new words persisted, and expiry did not finish the story automatically. |
| New story or opening/editing another does not erase meaningful current draft | Pass, DOM | Pass, DOM | Pass, DOM | Reading left the current draft alone. Starting a new story or making an edited copy retained the old draft; it could be resumed after reload. The original finished copy remained unchanged when an edited copy was finished. |
| Removal is recoverable | Pass, DOM | Pass, DOM | Pass, DOM | Removal retained the original complete record. Recovery worked after reload, and did not replace the active dragon draft. |
| Core flow by real keyboard, with usable focus and labels | Unverified | Unverified | Unverified | Native buttons/form controls, form labels, focus targets, and `:focus-visible` rules were found; these are partial supporting evidence only. |
| Core flow at 390 CSS pixels and laptop width | Unverified | Unverified | Unverified | Responsive rules exist, but rendered layout, overflow, reachable controls, and reading comfort were not inspected. |
| Accessibility in an actual browser/assistive technology | Unverified | Unverified | Unverified | No accessibility tree, screen-reader, contrast, or live keyboard review. |

Selected failure-path checks also passed for every candidate: an archive write failure prevented replacement of the current draft; a draft write failure after archiving kept the current editor and recoverable words; a failed finished-story write left the draft and older saved stories intact; malformed stored JSON was not overwritten by subsequent attempts to write, finish, and start over. These additional checks strengthen the preservation conclusion but do not stand in for the missing browser checks.

## A

### Interaction assessment

A provides a direct oral entry point: “Say the first sentence out loud,” followed by a question generated from the current character and place. The story field is available immediately, and its guidance connects wanting something, encountering the twist, and trying a way through. This is a concrete response to the observed starting hesitation. It does not require selecting a mode or configuring a session.

Individual prompt changes work without disturbing the other cards or words. **Undo change** restored the exact previous prompt trio in the exercised scenario. The prompt area remains part of the writing page, so changing one ingredient does not require a separate phase transition.

Finishing creates a saved story and opens a separate reader containing the full text, title, and a completion marker. The shelf combines the active draft, parked unfinished stories, and finished stories with distinct labels. Search includes text and original prompt strings, so the supplied active dragon draft can be found there. This is an implemented retrieval aid, not just a promise in copy.

### Best moment

**An accidental New story does not end the old story.** A parks the unfinished words, opens a fresh draft, and exposes the preserved story as an in-progress item on the same shelf. Resuming it after reload restored the exact old text and prompts. The recovery requires no interpretation of an overwritten editor or hidden storage state.

### Principal weakness

Recovery from New story requires going to the shelf and selecting the unfinished item; there is no direct bring-back action in the resulting message. B offers that shortcut. A's shelf makes the longer route coherent, so this is additional navigation rather than a preservation defect.

For beginning, A supplies a useful spoken question but no optional insertion of a sentence stem. Whether that lighter approach is sufficient for the initially stuck child remains untested; I would not turn that difference alone into a preference against A.

## B

### Interaction assessment

B makes beginning an executable action. **Start with this line** inserts a character/place sentence stem ending in “because,” changes to a compact prompt summary, focuses the editor, and places the caret at the end. **I have my own beginning** provides an alternative without supplied text. The editor is also present before either choice, so these controls are assistance rather than a mandatory gate.

The help beside the editor includes the actual current complication in its next-step question. That connects a prompt to a story event more concretely than leaving the three ingredients as isolated labels. Its benefit for this family is plausible, while the actual text insertion, focus, and phase change are verified behaviors.

The finished reader clearly distinguishes a newly completed story from ordinary reading. The bookshelf separates finished, in-progress, and removed records. The current draft appears in the in-progress shelf, and both text and prompt-based search work within the selected shelf. New story provides a direct **Bring it back** action in addition to the durable archived draft. Removal similarly provides an immediate undo and a persistent Removed shelf.

### Best moment

**The opening sentence becomes editable words with one action.** The stem is inserted, the caret is ready for the reason the character arrived, and the prompts condense into a reference summary. This gives the uncertain writer a specific next action while preserving the option to begin independently.

### Principal weakness

After entering the writing phase, a later prompt change takes a detour: **See cards → Change place → Back to my page**. A and C retain their swap controls on the writing page. The compact summary might help concentration, but that visual benefit is unverified; the additional controls needed to return to the same editing state are concrete.

## C

### Interaction assessment

C presents the oral first-sentence invitation directly and puts additional nudges in expandable sections. Opening **Find a first line** and choosing **Borrow this opening** inserts a sentence and focuses the editor. If words already exist, the control labels its behavior as adding an opening at the end rather than silently replacing text.

Changing one ingredient preserves the other two and the draft. A written draft triggers confirmation before shuffling all three cards. That confirmation is a warning before the broad change, rather than a way to restore a previous individual card; no prompt undo is implemented.

Finishing creates a complete reader and saved record. In the simulated failed-save case, C still opened a reader, explicitly labeled it as not saved, and exposed the text-copy control. This avoids presenting an unsuccessful save as successful, though actual download behavior is unverified.

Starting another story archives the current words as a draft on the shelf. Resuming an archived draft after reload and restoring removed stories both worked. The active draft itself is not included in shelf results until it has been archived or finished.

### Best moment

**An unfinished story becomes a clearly labeled item to continue when starting another.** The previous text and all three prompt strings survived the transition and reload, and the shelf's continuation action returned them to the editor unchanged. This directly addresses the observed erased-ending problem without requiring a confirmation dialog on every new story.

### Principal weakness

**The shelf omits the current draft.** With the supplied nervous-dragon draft active, searching the shelf for that draft cannot find it, even though its text is retained and the writing tab can recover it. A includes that current draft on its unified shelf; B includes it under In progress. C therefore asks the family to understand that “kept on this device” and “on your shelf” are different states before they can confidently locate unfinished work. This is retrieval friction, not demonstrated data loss.

## Pairwise judgments

### A versus B — tie

Both completed the central flow and preservation/recovery scenarios. B's inserted opening, contextual complication nudge, and direct new-story recovery action are useful, concrete assistance. A keeps prompt editing directly available and makes active and parked drafts visible together with finished stories. The observed differences trade beginning assistance and a recovery shortcut against simpler access to ingredients and a unified shelf. Without actual use or rendered inspection, they do not justify a confident net preference.

### A versus C — prefer A

Two concrete differences support a modest preference:

1. A's prompt undo restored the exact previous trio after changing a place. C offers another random swap or broad-shuffle confirmation, but no restoration of the previous card. This gives A a direct recovery action for a regretted prompt change, relevant to the observed attachment to particular ingredients.
2. A's shelf includes the active dragon draft and lets it be found there. C's shelf excludes it until it is archived or finished. A makes draft retrieval more consistent with the shelf's purpose.

C's expandable help and explicit unsaved reader are useful choices, and C passed the same central safety scenarios. The differences do not reach a strong preference or establish that C is inadequate.

### B versus C — prefer B

B supplies the same exact prompt-change recovery that C lacks, and includes the active draft in an identifiable In progress shelf. Its direct **Bring it back** action also gives an immediate route back after an accidental New story; C requires navigating to the shelf and selecting the archived item. Those are concrete differences in recovery and retrieval effort.

B's opening insertion is more directly exposed than C's expandable first-line helper, but I do not rely on an untested claim that it is easier for a child to notice. C keeps ingredient changes available without B's phase detour. The supported preference remains modest.

## What remains unresolved

The implementations are strong enough in the checked central logic that a rendered browser pass could materially change the ordering. In particular, first-screen density, scrolling to the editor and finish action, mobile wrapping, actual focus movement, modal behavior, readability of the finished story, and family reactions to tone were not observed. No attractive markup, amount of styling, feature count, or confident worker claim was treated as evidence of live usability.
