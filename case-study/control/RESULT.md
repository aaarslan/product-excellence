# Recovery-safe live conversion

## Selection

The most consequential bounded problem was the editing loop. A partially typed quoted cell could be silently misparsed, an empty quoted cell could cause a parser exception, and ragged rows were still rendered with error text prepended to otherwise copyable output. Clearing the input also left an old result on screen. This makes ordinary correction unsafe and makes it hard to trust what is being copied.

I selected recoverable parsing and clear conversion state, rather than a visual redesign or additional formats.

## Changes

- Added a deterministic CSV/TSV field reader to the active parsing path. It handles quoted delimiters, doubled quotes, multiline fields, empty quoted fields, CRLF and trailing empty cells. It reports unfinished quotes and invalid quote boundaries rather than skipping characters.
- Kept input unchanged on errors. A separate live status region above the output explains the problem and explicitly identifies retained output as previous output, not a result for the current input or settings.
- Blocked rendering of ragged rows. Diagnostics specify the logical row and expected/actual column counts and suggest checking the delimiter or finishing the row. Parser error state resets on each parse.
- Updated on the input event, covering edits and paste without requiring a key release or blur. Clearing input clears the old output and returns to a paste prompt. Successful repair updates the result normally.
- Made generated output read-only and select-on-click, with accessible labels and status association. It remains selectable for normal keyboard copy. Added invalid-input semantics and visible error styling.
- Corrected the decimal setting's missing argument and assignment bug so it continues to work through the new conversion path.
- Preserved existing formats, renderer implementations, settings controls, branding, sample, dependencies, attribution, comments and legal notices. Fixed the duplicate output header ID. The legacy parser helper is retained, but conversion now calls the new field reader.

## Verification

Executed locally with Node v24.22.1:

- `node tests/editing.test.cjs`: 13 passing groups.
- `node --check js/CSVParser.js`: passed.
- `node --check js/converter.js`: passed.

Regression cases include quote recovery, malformed boundaries, empty quoted cells, embedded lines, CRLF, short/long rows, error reset, tab input, generated headers, header casing, decimal dot/comma, blank input termination, valid/incomplete/repaired transitions, stale-result preservation on format/settings changes, render failures and clear-input behavior. All fourteen original formats produced nonempty output for a simple rectangular synthetic fixture. JSON output for the ordinary and decimal fixtures was parsed and compared with expected values.

Controller lifecycle checks invoke the actual converter methods with simulated textarea/status objects. They are not browser end-to-end tests. The changed source was reviewed against pre-edit copies, and temporary review copies were removed. No dependencies were added or installed, no external services were called, and no publication or deployment occurred.

## Limits and remaining gaps

No browser was used, as required by the assignment. Native paste, focus, selection/copy, screen-reader announcements, and the status layout have not been exercised in a browser. Existing narrow-screen and short-window layout limitations remain; this work does not claim responsive validation.

This is not a full serializer correctness audit. Existing renderer limitations remain, including JSON escaping for embedded quotes/backslashes, permissive numeric inference, duplicate property names and format-specific escaping. The fourteen-format smoke test does not establish validity of every possible output. Automatic delimiter inference retains the existing count-based behavior; explicit comma/tab selection remains available for ambiguous input. Input is not persisted across reloads, and the existing sample action still replaces the input. Retained stale output can still be selected manually, but is explicitly identified in the status region.
