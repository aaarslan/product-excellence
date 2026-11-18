# Night Shift prototype

**Deliverable:** `index.html` — one self-contained, dependency-free page that opens locally. All styling, scripts and the mill/river illustrations are embedded. `TASK.md` and `CONTEXT.md` were left unchanged.

## What works

The experience centres on a worthwhile visit for two, with a paper-and-ink visual identity tied to Calder Mill. Visitors choose 45, 60 or 90 minutes, an interest for each person, and an optional ground-floor-only route. The planner balances their interests, includes movement allowances, joins demonstrations at their scheduled starts, and respects closing times.

The default 60-minute route is Small Machines at 18:30–18:50, then River Listening Room at 18:53–19:13, leaving seven minutes spare. Postcard making is always last; its timing is conditional on a free seat, with a queue warning and an alternative where one fits. Visitors can mark stops visited, rebuild without a stop, restore removed stops, and expand the complete six-activity programme. Access, atmosphere, café, toilets and desk information are included.

## Checks and limitations

Local jsdom checks passed all 150 combinations of time, paired interests and access preference, plus visit toggles, pending edits, removal/restoration, empty-state recovery and programme rendering. Checks found no script errors, external resource dependencies or duplicate IDs.

Browser execution was unavailable: no visual layout, real keyboard, assistive-technology or user verification was performed. The page uses a fixed 18:20 demo clock. Rebuilding starts from that time and clears visited marks; progress is not saved after reload. Room availability, postcard queues and individual walking pace remain unknown. No reservations or live availability are implied.
