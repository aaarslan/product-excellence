# Actual browser observations

Chromium exercised the local source snapshots, served from a loopback-only Python static server. No live public product was changed and all entered data was synthetic. The preview server was stopped afterward; browser zoom was restored.

## Original

A keyboard-triggered conversion of `name,qty` / `A,1` produced ordinary JSON. Clearing input left that JSON visible. Pasting `name,qty` / `"open,1` and triggering conversion produced `[{"name":null,"qty":1}]` without an error. These are reproduced defects, not assumptions from an issue report. A lone quote was tested only in a bounded Node VM, not deliberately used to freeze Chromium.

## Both frozen implementations

Browser input-event changes, without requiring a key release, converted ordinary data. An unfinished quote retained the previous output with an explicit stale warning. Repair replaced it; clearing input cleared output. All source input remained visible and intact. Raw observations are in browser-checks.json.

Actual click-to-select and Control-C copies of quoted-text output were read from the browser clipboard and passed to JSON.parse. The baseline's copy failed parsing; the skill-assisted copy preserved the intended quoted text. Raw copied strings and parser outcomes are in clipboard-checks.json. Browser inspection also confirmed the distinct backslash and duplicate-header behavior reported there and in the independent probes.

## Corrected demonstrator

Unsafe integer input blocked with no new output, identifying the source row/column and the text-preserving choice. Clicking that choice produced string-valued JSON. The actual copied and parsed identifier remained `9007199254740993`. Disabling it retained the old result with a stale warning; changing input to ordinary `1.5` restored numeric output. precision-browser.json records this sequence before the later wording clarification.

After copy clarification, the page was reloaded and the block → explicit text recovery path was re-exercised. Updated screenshots show the final identifier hint and singular/plural status. Numeric behavior did not change. The old JSON trace is retained as the observation at its actual time, not silently rewritten.

## Layout and accessibility limits

Desktop viewport width was 1180 CSS pixels. Ordinary browser zoom gave a 393-CSS-pixel viewport for the frozen skill trial, document width 388. Both editors fit horizontally and the layout was stacked and scrollable; the screenshot captures the upper part of that scrollable page. This is not a 375px device test and was not a matched narrow-screen comparison against the baseline.

Native textarea selection/copy and checkbox activation were exercised. Full sequential keyboard navigation, screen-reader output, touch-device behavior, large-input responsiveness, and measured accessibility contrast were not tested. Source live-region markup is not proof of assistive announcements. No claim of complete responsive or accessibility certification is supported.

Screenshots are raw browser page captures, not rendered mockups. They exclude personal browser chrome and contain no customer data. No screenshot of the terminal or unrelated browser tabs is included.
