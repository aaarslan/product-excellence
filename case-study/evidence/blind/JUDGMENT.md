# Independent blind comparison

## Judgment

Prefer x for the specified paste, edit, recover, export journey, with an important data-corruption blocker before calling it generally reliable. This is a judgment about observable outcomes in this pair, not evidence that more scope or a particular process is better.

Both make a consequential, appropriately targeted improvement: incomplete quotes and uneven rows become recoverable editing states, rather than malformed or partially rendered output. Both retain source input and last successful output, put explanations outside the machine-readable output, explicitly label retained output as stale, clear output when input is emptied, and resume conversion after correction. Both replace keyboard-only handling with the input event. Their state machines are bounded loops rather than the legacy regex parser on the active conversion path.

x goes further in ways that directly help the default export journey: real JSON serialization preserves quotes, literal backslashes, and multiple embedded newlines; quote-aware first-record delimiter detection accepts TSV whose data cells contain many commas; duplicate headers and dictionary keys are rejected instead of silently losing values in downstream parsing. These are concrete usability and data-fidelity benefits, not points awarded for feature count.

However, x's new JSON numeric conversion changes `9007199254740993` into the literal output `9007199254740992`. This is a new regression caused by `Number(value)` before `JSON.stringify`. y retains the original number token in its output. JavaScript JSON.parse rounds y's token too, but a lossless JSON consumer could preserve y's output whereas x has already destroyed the original number. x should preserve unsafe numbers as strings or block with a specific explanation, and should establish an explicit policy for numeric-looking identifiers and precision. Neither implementation should be described as universally safe for spreadsheet identifiers.

## Evidence

Read the requested task and pre-run criteria, both implementations' actual source, and the corresponding original public source. Did not read implementation RESULT.md reports, skill files, other evaluation evidence, or named arms.

Ran two independent Node VM checks, with a 1-second execution timeout on each evaluated script. They instantiate the actual converter prototype and parser/renderer code with minimal field objects. These are controller/parser simulations, not browser or accessibility tests.

Artifacts:
- `independent-check.cjs` and `independent-results.json`: fourteen matched cases per arm.
- `independent-sequence.cjs` and `independent-sequence-results.json`: successful conversion, incomplete quoted edit, corrected edit, then dispatch through all fourteen existing formats on ordinary data.

Observed:

| Case | x | y |
| --- | --- | --- |
| Ordinary CSV, quoted comma | Correct default JSON | Correct default JSON |
| CSV escaped quote | Valid JSON preserving quote | Invalid JSON while status reports updated |
| Literal `C:\temp\new` | Preserved literal backslashes | Valid JSON but decoded value contains tab/newline instead of backslashes |
| Quoted cell with two newlines | Valid JSON preserving both | Invalid JSON; legacy escaping only replaces the first newline |
| TSV header plus comma-heavy data cell | Correct automatic delimiter | Wrong delimiter; blocks export and gives repair hint |
| Missing closing quote, extra-column row | Previous output retained, clearly stale; input preserved | Same useful behavior |
| Duplicate headers | Blocks with actionable alternative | Outputs duplicate JSON properties; ordinary consumer loses first value |
| Duplicate dictionary key | Blocks with actionable alternative | Outputs duplicate key; ordinary consumer loses first row |
| Large integer | Rounds output token, regression | Preserves raw token, downstream consumer may still round |
| Leading-zero identifier | Converts `00123` to number `123` | Emits invalid JSON numeric token `00123` |
| Empty input | Clears output | Clears output |
| Explicit tab delimiter and decimal comma | Converts numeric value to 1.5 | Same |
| Recovery after incomplete quote | Current corrected output replaces stale output | Same |
| Existing format dispatch | All fourteen produce output without exception on ordinary synthetic data | Same |

All fourteen main cases retained the source input exactly. Format dispatch is not validation that every output language is syntactically or semantically correct.

## Attribution of limitations

Most of y's output-fidelity problems are inherited, not introduced: the original renderer concatenates unescaped JSON strings and duplicate property names; the original delimiter heuristic counts all commas/tabs; the original type inference treats numeric-looking values as numbers. y's narrower scope protects editing recovery but still reports success for ordinary quoted data that cannot be used safely in the default target format. This is a relevant remaining gap in the user journey, not a claim that y introduced all those defects.

x's serializer removes several inherited JSON defects but expands the type-conversion surface and introduces the independently reproduced precision regression. It also changes empty numeric cells in JSON row/column arrays from legacy zero to null. Null is a defensible missing-value meaning, but this is a real semantic compatibility change rather than merely formatting. Its first-record delimiter detection remains heuristic; users still need explicit delimiter settings for ambiguous input. The untouched non-JSON renderers retain their legacy escaping limitations in both arms.

Both intentionally keep old output available during errors. The warning must remain conspicuous near the output, particularly after a format change, or people can still copy stale output. x names the prior successful format; y does not. y places status between the input and output and marks known input errors with aria-invalid; x places status after output and does not set aria-invalid. x adds responsive CSS and a select label, but this review awards no verified responsive/accessibility benefit without browser evidence. Neither DOM simulation proves real input-event delivery, selection/copy interaction, layout, or screen-reader announcements.

No dependencies, CI, or external services were added in the reviewed source differences. Both preserve existing renderer formats and controller settings. The unchanged legacy CSVToArray remains in both files but is no longer their active parser. x's broader edits are still related to the requested workflow, yet its JSON rewrite needs the precision fix before an unqualified recommendation.

## Remaining gates

1. Fix and regression-test x's numeric precision loss, with a documented identifier/type policy.
2. Verify actual browser paste/input events, error-to-recovery behavior, stale-output visibility during format changes, small-screen layout, keyboard selection, and accessibility announcements.
3. Validate meaningful output semantics beyond ordinary smoke data for any non-JSON format claimed as reliable. Avoid conflating existing-format availability with correctness.

Overall: x delivers the stronger common-data journey in these independent checks; y is the smaller and less type-invasive intervention. Neither is a complete data-fidelity solution, and x's new silent precision loss is material despite its overall advantage.
