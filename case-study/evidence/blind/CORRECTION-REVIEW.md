# Targeted post-review precision correction

This reviews the separate demonstrator against original frozen x. It does not change the original comparison, remove the original regression, or re-score either trial arm.

## Verdict

The reported unsafe-integer regression is corrected in the reviewed demonstrator. Numeric JSON values that cannot survive the new decimal identity check are rejected before replacing output; input and prior successful output remain intact, with an actionable warning. An explicit, initially off text setting provides a recovery path that preserves parsed cell strings. I found no new nearby data-corruption regression in the inspected correction or independent cases.

This is a targeted acceptance of the correction, not a guarantee of every numeric inference, format, browser interaction, or input size.

## Source review

- `jsonNumber` compares a canonical decimal identity of the input token with the serialized finite number, additionally rejecting integer values outside the safe integer range. It rejects underflow/overflow and decimal tokens whose significant digits would change.
- `decimalIdentity` normalizes sign, leading/trailing zeros, decimal fraction length, and exponent without converting the significant-digit string to a floating-point value. It compares decimal meanings of the input and serialized JSON, not exact binary representation. Ordinary `0.1` remains allowed, appropriately for this decimal serialization check.
- Empty numeric cells still become null, matching original x. Non-numeric outliers retain their original strings. Negative zero now blocks rather than silently becoming zero. This is an intentional conservative behavior change.
- JSON dictionary keys bypass numeric conversion because JSON object keys are strings. The large-integer key case no longer encounters an unnecessary numeric rejection.
- Text mode bypasses JSON numeric conversion and suppresses decimal-comma normalization in the parser, so `1,234567890123456789` can remain exactly that cell text. Non-JSON conversion retains its prior behavior.
- The checkbox uses the existing settings class and Controller change flow, defaults off, and success status explicitly indicates that JSON values are text. Browser operation was not exercised in this review.

## Executed verification

1. Inspected the supplied test file before running it. Ran `timeout 10s node tests/conversion.test.js` from the demonstrator. All 17 reported checks passed. These include all four JSON forms, stale-output protection, deliberate recovery, positive and negative unsafe integers, long decimals, overflow/underflow, safe integer boundaries, dictionary keys, and static setting wiring checks.
2. Added and ran `blind/correction-check.cjs` with one-second VM evaluation limits. All 19 independent cases passed. Full observations are in `blind/correction-check-results.json`.

Independent cases included:
- Positive/negative `9007199254740993` reject without replacing previous output.
- `0.100000000000000005` and `123456789.123456789` reject rather than round.
- Very small exactly serializable decimal notation remains usable.
- `1e-324` and `4e-324` reject; `5e-324` remains allowed because its JSON token round-trips under the chosen decimal identity policy.
- Negative zero rejects.
- Leading-zero identifiers and spaces are preserved exactly with text mode enabled.
- Text mode preserves empty strings, decimal commas, quotes, literal backslashes, tabs, LF, CRLF, and surrounding whitespace within parsed cells.

These are actual parser/converter executions with simulated field objects. They do not establish browser paste behavior, keyboard accessibility, visual prominence, or live checkbox event delivery.

## Important remaining boundaries, not new correction faults

Default numeric inference still converts `00123` to number `123`, trims numeric whitespace, and normalizes notations such as `000.12500` to `0.125`. Independent checks confirm this. Those behaviors already existed in original x; the correction provides an opt-in text escape route rather than changing the default inference policy. Do not describe default mode as preserving identifiers or exact cell notation. The warning says “precision or notation change,” but the predicate intentionally allows value-equivalent notation changes; this phrase is broader than the actual check.

“All JSON cell values are text” describes parsed values, not a byte-for-byte CSV round trip. CSV quote syntax is decoded, header settings still apply, duplicate object keys still block, and normal parser row processing remains. That is consistent with exporting spreadsheet cells, but should not be confused with preserving the raw CSV file.

The guard conservatively blocks some mathematically exact integers above the safe range. This is an explicit safe-range policy, not evidence those particular integers necessarily rounded. Text mode is a usable workaround. Decimal-comma inference and dictionary key normalization outside text mode retain their existing parser semantics; the correction does not resolve every legacy type choice.

No source files were changed during review. No browser, installation, CI, external actions, or paid calls were used. Original x's numerical corruption remains documented in the frozen original judgment; the corrected demonstrator is a separate post-review artifact.

## Final wording clarification

The demonstrator subsequently clarified the warning to “this value cannot be represented safely in numeric JSON mode,” added visible guidance about identifiers/leading zeros and default inference, and corrected singular/plural success copy. Numeric behavior is unchanged. Updated only the independent check's expected warning phrase, retaining all output-retention and exact-value assertions. Reran `node correction-check.cjs` against the actual demonstrator: all 19 independent cases passed. The broader-warning wording observation above describes the earlier reviewed copy and is now resolved. The frozen original comparison remains untouched.
