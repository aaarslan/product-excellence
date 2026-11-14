# Coordinator browser observations, round one

Both implementations were inspected with actual Chromium through the supported browser-control tool. Local servers launched through the execution tool were not reachable from Chromium; an inspected Node server launched in the native terminal was reachable. No network security settings were changed. All service data is synthetic.

## Before

The pristine queue displayed four rows, working search/priority controls, and a CSV action, but no selection controls. Send selected was disabled. Desktop visual hierarchy was inspected.

## Matched journey, both arms

- Initial state: four rows; the already-sent row could not be selected.
- Selected the first two ready handoffs and submitted. Observed per-batch progress and disabled send/selection controls during work.
- Actual service returned success for the first and its intentional 503 for the second. Both interfaces preserved the successful item and visibly explained the recoverable failure.
- Pressed Enter on the retry action. Both displayed one-item retry progress, not a repeat of the successful item, then success. Reload confirmed server-backed sent status.
- Selected the remaining ready row with Space, then searched for a different account. Control retained selection with an explicit hidden-count label; skill cleared selection with an explicit explanation. Both are coherent strategies.
- Filtered to Harbor/high and downloaded CSV. Both actual downloaded exports contain the expected four columns and only the visible row, with its sent status. Files retained alongside these notes.
- A no-match search produced an empty-state explanation. Skill disabled send; control kept its explicitly disclosed hidden selection available.
- Reloaded, selected the remaining ready row, stopped both local services, and submitted with Enter. Both reported unconfirmed delivery/failure and retained an explicit retry path; neither marked the row sent.

## Design observations, not a user study

The skill implementation reused one primary action for send/retry and a select-all checkbox. The control added separate Select visible ready, Clear selection, Send selected, and Retry failed actions. The skill version is visually quieter in this example; the control provides more explicit bulk controls. No preference study or causal attribution establishes which is better for real shift leads.

## Limits

Observed desktop content width was 1180 CSS pixels. Native resize attempts had no effect; browser DevTools responsive preview was blocked by organization policy. No bypass was attempted. Ordinary browser zoom provided a narrower rendered check for the skill arm: innerWidth 393 CSS pixels, document scrollWidth 388, and no visible input/select/button extended beyond the viewport. Zoom was restored afterward. This is not device emulation; an exact 375px mobile check and an equivalent narrow control-arm check remain unverified. Space selection and Enter submission/retry were exercised, but full sequential Tab navigation and screen-reader announcements were not. Live-region markup and accessibility-tree names are not a screen-reader test. Screenshots were inspected internally, not packaged as public artifacts.

No public system, customer account, or production service was changed. Native demo servers were stopped after interruption checks.
