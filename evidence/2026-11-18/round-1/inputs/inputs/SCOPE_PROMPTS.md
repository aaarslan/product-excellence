# Small scope probes

Run each prompt in its own fresh session. Give only the selected prompt to the worker. These are separate from the three main cases.

## Probe A — literal copy (the fourth case)

Return exactly this sentence, with no preface or changes:

`Your draft is saved on this device.`

## Probe B — bounded copy edit

Change this button label to sentence case and return only the revised label: `START A NEW STORY`

## Probe C — technical diagnosis

Why does `Boolean("false")` return `true` in JavaScript? Answer in two sentences. I only need the language behavior, not a product recommendation.

## Probe D — explicitly limited product copy

Give me exactly three button labels for reopening a saved story. Each label must be at most three words. Don't suggest features or change the flow.
