# Packaging notes

All task inputs, frozen skill instructions, worker HTML/recommendations, original reviewer judgments, and recorded results are retained. `runs.json` and `blind-map.json` provide the identities after review. All six final outputs are hashed in `completed-outputs.json`.

Original scripts remain as `*-original.cjs`. Portable scripts use repository paths and the pinned local jsdom dependency and write separate `*-rerun.json` files. The first Night Shift review’s portable script also adds a failing process exit status when its existing results contain violations or failed preservation assertions; its original observations and assertions are unchanged. The underlying apps were not edited.

The first reviewer corrected a prefix comparison to compare earlier activity identities/times rather than all DOM text: the preserved stop correctly receives a new earlier-stop label after recovery. Its report discloses the correction. The coordinator independently checked that same concrete recovery distinction in `checks/recovery-check.cjs`.

The first reviewer’s jsdom harness uses a file URL as metadata. This is not a real browser, an actual file-URL storage check, or an offline-browser test. Other DOM checks use artificial HTTPS origins. No rendered application or native keyboard/assistive-technology behavior is claimed.

Worker handoff notes contain their own check counts. The independently authored reviewer scripts and the coordinator’s focused check are the reproducible verification in this package; numbers of scenario combinations are not numbers of independent product trials.
