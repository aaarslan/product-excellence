# Night Shift visitor prototype

**Output:** `index.html` — one self-contained, dependency-free file with embedded styling, JavaScript and a mill illustration. Open it locally; no internet connection is needed.

The experience gives two visitors a shared route based on 45, 60 or 90 minutes, their separate interests, and an optional ground-floor-only requirement. Its default 18:20 plan starts with Small Machines at 18:30, followed by the River Listening Room. It includes estimated movement, scheduled starts, closing times and time to head out. When both interests cannot fit, it says so.

Visitors can open a compact visit view, inspect all six rooms, or copy the route into their notes. “Full, or not for us?” lets them omit unavailable or already visited rooms, enter their current time and floor, and replan while keeping their departure time. Invalid times and no-fitting-activity states have recovery paths. Changing the visit length deliberately changes the departure time.

**Checked locally:** JavaScript syntax and DOM initialization; 96 combinations of duration, paired interests and floor restriction; 80 additional feasible schedules involving later starts, excluded rooms and either starting floor. Checked fixed starts, activity closing times, transfers and departure limits. DOM checks covered choice changes, visit view, replanning validation, empty-state recovery, copy success and manual-copy fallback. No external asset references were found.

**Limits:** Browser execution was unavailable, so visual layout, actual mobile use, keyboard interaction and accessibility were not verified. DOM checks do not establish those qualities. The demo clock starts at 18:20 and advances only through manual replanning. Capacity, postcard queues and walking pace remain unknown. The current plan lasts while the page stays open; copying it provides a portable version. No reservations or live availability are offered.
