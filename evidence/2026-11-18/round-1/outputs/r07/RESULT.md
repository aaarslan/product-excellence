# Ship an opt-in worktree picker

Add **`--pick`**, a plain numbered chooser that makes developers select the checkout immediately before running a task:

```sh
wrun --pick test -- --runInBand
```

Example chooser on stderr:

```text
1  main                 /work/app           [current]
2  fix/payment-retry    /work/app-retry
3  detached @ a1b2c3d    /work/release
Choose worktree number, or q:
```

List only the current repository’s registered worktrees. Show each full canonical root and its branch, or a short commit ID for detached HEAD. Never truncate paths. Require an explicit number, even with one candidate; Enter has no default. Blank or invalid input stays in the chooser. There is no second confirmation.

Without `--pick`, preserve resolution, configuration, banner-free streams, and statuses exactly, including in a TTY.

This earns its place beside `--repo`: developers can recognize a remembered branch and distinguish similar directories without finding and copying a root path. Detached checkouts remain selectable. The cost is one deliberate choice per run; developers who already know the root retain `--repo`.

## Execution and failure paths

- **Valid selection:** Immediately re-read Git metadata and verify that the selected canonical root remains registered and its branch ref or detached commit identity matches the displayed selection. Load that root’s existing `.wrun.json`, execute there, and forward arguments after `--` unchanged, without shell evaluation. After the chooser, child stdout/stderr and exit status pass through unchanged—including intentional exit 1.
- **Changed or missing selection:** A renamed branch, removed worktree, or identity mismatch aborts before execution with a specific stderr error and exit 2. Tell the developer to rerun `--pick`; never substitute another worktree or fall back to the current directory. Config, task, or launch errors also use stderr and exit 2.
- **Cancellation:** `q`, EOF, or Ctrl-C exits 130 without launching a task.
- **Unsuitable invocation:** Require interactive stdin and stderr. Otherwise exit 2 with guidance to use `--repo <root>`. Outside a Git worktree, or when combined with `--repo`, fail with exit 2 before execution.

## Two-day boundary

Day one: implement the chooser and preflight using the existing resolver and executor; add a help example. No new configuration or Git mutations.

Day two: compare existing implicit and `--repo` invocations byte-for-byte in terminals and automation; check argument forwarding and statuses 0, 1, and 2. Exercise cancellation, detached HEAD, identical directory names, branch renaming, and removal during selection. Ask five engineers to try wrong-terminal recovery and repeat use; observe whether they reliably choose their intended checkout.

Existing commands remain cwd-sensitive. Promote `--pick` in human-run examples; adoption is the unproven assumption. Preflight does not atomically lock out concurrent Git changes. These checks and trials are proposed, not completed.
