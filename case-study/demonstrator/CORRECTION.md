# Post-review precision repair

This is a correction to the copied demonstrator, not an improvement credited to the frozen comparison. The original trial and its evidence were not edited.

## Confirmed regression and cause

The prior JSON implementation called `Number(value)` before native serialization. For the synthetic input `id\n9007199254740993`, JavaScript rounded the value to `9007199254740992`. The previous tests covered escaping and conversion states but not precision boundaries. Long decimal tokens were also vulnerable.

## Repair

The numeric JSON path now compares the decimal value represented by the input token with the value represented by the serialized number. It uses normalized decimal strings rather than converting both sides to floating point. Integer values beyond JavaScript's safe-integer boundary are rejected even when a particular token happens to be representable. Overflow, underflow, and unsupported numeric notation also fail safely. Ordinary numbers, common decimals, exponents and safe-integer boundary values remain numbers.

A rejected conversion preserves the input and last successful output, explicitly marks the output as stale, and identifies the source row/column. With no prior output it leaves the output empty. It never silently rounds these values or silently substitutes strings for them.

The recovery is an opt-in setting: **JSON: keep all cell values as text**. Selecting it deliberately makes all JSON cell values strings, retaining exact content including decimal commas, leading zeros, blanks and surrounding spaces. A successful status also announces this text mode. Turning it off restores normal numeric inference and its safety checks. The setting uses the existing change handler and does not affect non-JSON formats. Dictionary keys were already strings and are kept exact without unnecessary numeric conversion.

This is intentionally conservative: exact large numeric literals are not emitted in numeric mode because common downstream JSON parsers may round them. Text mode changes the schema only after an explicit user choice. It does not selectively guess which fields are identifiers or financial values.

## Verification

Successful commands:

- `node --check js/converter.js`
- `node --check js/Controller.js`
- `node tests/conversion.test.js`

All 17 grouped checks pass: the 11 existing checks plus six focused regression groups. New coverage includes the exact reported one-column regression; unsafe positive and negative integers; long fractional values; overflow and underflow; all four JSON shapes; preserving a prior result on failure; explicit text-mode recovery; disabling the setting; ordinary decimals and exponents; safe integer boundaries; decimal-comma behavior; exact dictionary keys; and source-level settings wiring.

The tests execute the real conversion code with simulated fields in Node. No browser was used. Actual clicking, copy/paste and accessibility remain for coordinator verification. Existing limitations for legacy non-JSON rendering remain as documented in RESULT.md. No dependencies, CI, external calls, installation, publishing or paid validation were introduced.

Coordinator clarification after review: the setting now explains its identifier/leading-zero use before conversion. The rejection message describes numeric JSON safety rather than implying that all notation normalization is blocked. No numeric behavior changed.
