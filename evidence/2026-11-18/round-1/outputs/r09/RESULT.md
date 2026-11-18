## Ship an opt-in worktree picker

Add **`--pick`**, using the existing task execution path:

```sh
wrun --pick test -- --runInBand
```

The obstacle is choosing the intended checkout from an ambiguous terminal. Better documentation for `--repo` leaves developers finding paths themselves; a branch-only selector excludes detached HEAD. A picker exposes branch identity and the authoritative root together, using Git’s existing worktree list.

### Developer experience

Discover the repository containing the current directory. Write a numbered menu to stderr showing each existing worktree’s **full branch name, absolute root, and short commit ID**; label detached HEAD explicitly and mark the current worktree. Show the requested task and forwarded arguments above it.

Require an explicit number; **Enter has no default**. Selection is the commitment to run, with no additional confirmation. Similar folder names remain distinguishable by their full paths. The selected row supplies the exact root developers can reuse with the existing `--repo` option for subsequent commands or automation.

Immediately before execution, refresh Git metadata and verify that the selected root still belongs to this repository and its branch/detached state and HEAD match the displayed selection. Load that root’s `.wrun.json`, validate the task, and execute from that root with the existing argument-array behavior. Print the chosen identity to stderr before starting; forward arguments after `--` unchanged. Once started, relay the child’s streams and return its exit status, including intentional exit 1.

### Failure and recovery

- **Invalid number or blank input:** explain the valid choices and keep the menu open; execute nothing.
- **Cancellation:** `q`, EOF, or Ctrl-C executes nothing and exits 130.
- **Changed identity, removed worktree, inaccessible root, or launch failure:** stderr diagnostic and exit 2; tell the developer to rerun selection. Never fall back to the current directory.
- **Missing/invalid selected config or task:** identify the selected root and problem; exit 2 without execution.
- **No repository, no available worktrees, or noninteractive input/output:** fail clearly with exit 2. Explain that `--pick` requires terminal stdin and stderr; direct noninteractive users to `--repo <root>`.
- **`--pick` with `--repo`:** reject the conflicting selectors with exit 2.

### Two-day scope and release evidence

Day one: picker and guarded handoff to existing execution. Day two: focused checks and trials with five engineers in their normal work.

Check existing invocations—including terminal use—for unchanged configuration handling, byte-for-byte streams, argument forwarding, and exit statuses. Exercise detached HEAD, similar roots, cancellation, rename/removal during selection, and missing tasks. Observe whether engineers select their intended checkout and voluntarily reuse the picker; adoption is unproven. Existing commands remain unchanged and retain their current-directory risk.
