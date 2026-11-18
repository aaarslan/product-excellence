# Story Break

Implemented **index.html** as a self-contained offline experience using plain HTML, CSS, and JavaScript.

The central journey is “find a spark → make it happen → read aloud.” Each prompt changes independently and can be undone. A spoken sentence starter gives the family an immediate first move, then the prompt cards fold away to make room for writing. Four small story beats offer optional guidance; four sentences are explicitly enough. A finished story opens as a generous reading page with its title, original prompts, and a downloadable text copy.

The bookshelf identifies stories by title, character, and excerpt and searches their text and prompts. Starting fresh automatically parks unfinished writing in **In progress**. Reading an older story leaves the active draft alone; editing an older story makes a copy. Removed stories remain recoverable after reload. The eight-minute round is opt-in and never interrupts writing.

Retained both legacy storage keys and preserved supplied legacy text, titles, and prompts, including prompts outside the new deck. Added a separate paused-draft key. Storage failures are surfaced without false save success or discarding current work; malformed stored data is not overwritten.

**Checks actually performed:** JavaScript syntax validation and 12 focused DOM-stub interaction/state-flow checks covering fresh use, legacy data, single-card swap/undo, starter insertion, blank finish, finish/update, interrupted-draft recovery, edited copies, removal/restore across reload, search, storage failure/retry, and malformed-data preservation. All pass; `verify.cjs` contains the harness.

Browser rendering was not exercised in this worker because the coordinator reported the runtime restriction and is arranging supported browser checks. Responsive CSS and keyboard semantics are implemented, but this report does not claim visual or browser accessibility verification.
