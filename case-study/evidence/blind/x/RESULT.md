# Reliable conversion through an editing interruption

## Selected outcome

A person can paste spreadsheet cells, fix an incomplete edit, and take clean output to another tool without losing their input or mistaking an old result for the new one.

Source inspection demonstrated the binding obstacle: malformed rows were rendered anyway, error prose was prepended to exported data, incomplete quotes could be skipped by the parser, and deleting all input left stale output visible. A copy button alone would make these unreliable results easier to export. I chose validation and recovery instead of a redesign or additional formats.

## Changes

- Added a strict CSV/TSV reader with actionable row-specific errors for missing/extra columns, incomplete quotes, and invalid quote placement. Quoted delimiters, escaped quotes, multiline cells, empty cells, CRLF and trailing record terminators are supported.
- Auto delimiter selection ignores quoted content and uses the first delimited record rather than counting punctuation inside values.
- Input events update the conversion on paste, undo and deletion as well as typing. Empty input clears the result.
- Errors appear in a separate live status region, never inside exported output. Failed edits keep the exact input and last successful output, explicitly labeled as stale and identifying its prior format, including when settings change. Correcting input replaces it automatically.
- Fixed decimal-sign wiring and the parser assignment bug so Dot and Comma settings actually differ.
- JSON exports use native serialization to preserve quotes, backslashes and embedded line breaks. Duplicate object headers and dictionary keys produce repair guidance instead of silently overwriting values. Row arrays remain available for duplicate headers. Empty numeric cells serialize as null rather than a fabricated zero; nonnumeric minority values stay strings rather than becoming null.
- Added accessible labels and read-only generated output, retaining click-to-select. Status and long headers can wrap; a narrow-screen layout keeps settings and both editors reachable without replacing the visual design.

## Protected behavior and tradeoffs

All 14 output formats remain selectable. Explicit delimiter selection, decimal selection, supplied/generated headers, case transforms, whitespace and tab/space indentation remain. The existing non-JSON renderers are unchanged. JSON formatting now comes from native serialization, so exact whitespace differs from the old hand-built output while the selected indentation and compact-output settings are honored.

The old attributed CSV utility is retained intact, but active conversion uses the strict reader. Upstream license notices and attribution remain. No dependencies, CI, external calls, deployment or installation were added.

Generated output is now read-only, so editing belongs in the input or destination tool. During an invalid edit the previous output remains selectable, deliberately accompanied by a stale-result warning rather than discarded. Duplicate-header rejection applies to object-shaped JSON, not every format. Automatic delimiter inference is still a heuristic; explicit Comma and Tab controls remain the way to resolve ambiguous data.

## Verification

Ran `node --check js/CSVParser.js`, `node --check js/converter.js` and `node tests/conversion.test.js` successfully. The test script uses only Node built-ins and synthetic data.

Eleven grouped checks cover quoted/empty cells, CRLF, embedded newlines, first empty cell, TSV auto detection with commas in quoted values, malformed structures, decimal settings, valid → incomplete → format change → corrected → empty state transitions, all four JSON formats with special characters, duplicate keys/headers, all 14 format smoke checks, header/case settings, whitespace settings and the input-event binding.

The conversion-state tests execute the real parser, renderer and converter in a Node VM with minimal field doubles. They are not browser interaction tests. The event-binding assertion checks source wiring, not actual paste event delivery. All-format checks establish conversion without exceptions and nonempty output for a simple fixture, not full syntax validity in each destination language.

## Limits

No browser/CUA was used, as instructed. Responsive appearance, native selection, keyboard behavior and screen-reader announcements are unverified in an actual browser. Legacy non-JSON renderer escaping and numeric inference have not been comprehensively redesigned or validated; use a destination-specific validator for production exports. Very large inputs remain synchronous, matching the existing architecture. Work is local and not published.
