# Ship one opt-in worktree picker

Add `--pick`, a numbered chooser for the current repository’s existing worktrees:

```sh
wrun --pick test -- --runInBand
```

This earns its place alongside `--repo`: it supplies discovery and deliberate selection when developers remember a branch but not its path. Keep `--repo` for developers and scripts that already know the root. Do not add a separate branch selector.

## Success path

1. Discover the repository from the current directory and list its worktrees. Each row shows the branch, or “detached” plus a short commit ID, and the canonical absolute root path. Mark the current worktree without preselecting it. Similar directory names remain distinguishable.
2. Require an explicit row number. There is no default; pressing Enter cannot start a task. Show the chooser on stderr. Require interactive stdin and stderr for this new mode.
3. Bind the selection to that exact worktree and its captured Git identity, branch/detached state, and HEAD commit. Immediately before loading configuration and launching, re-read the metadata and verify that the selection still matches. A rename, disappearance, replacement, or changed HEAD aborts with instructions to select again. Revalidation reduces the race window; it cannot make concurrent Git/filesystem changes atomic.
4. Reuse the existing explicit-root execution path: load the selected worktree’s `.wrun.json`, resolve the task, and execute its argument array from that root. Forward arguments after `--` unchanged, without shell evaluation. After the chooser, relay the child’s streams and return its exit status, including intentional exit 1.

## Failure and compatibility contract

Invalid or empty selection, unavailable worktree, noninteractive use, discovery failure, stale selection, missing/invalid configuration, and unknown task produce a stderr diagnostic and exit 2 without launching anything. Ctrl-C cancels with exit 130. Reject `--pick` combined with `--repo`. Never fall back to the current directory or follow a renamed branch to another worktree.

Existing invocations—including explicit `--repo`, terminal use, and flags appearing after `--`—retain their exact parsing, streams, and exit behavior. No default banners, prompts, configuration changes, or Git mutations. Existing invocations remain susceptible to mistaken terminal context; protection requires choosing the new mode.

## Two-day delivery

Day one: implement the chooser and revalidation around existing execution. Day two: verify byte-for-byte legacy stdout/stderr and statuses; argument forwarding; duplicate folder names; detached HEAD; cancellation; noninteractive rejection; and deletion/rename between selection and launch. Ask five engineers to try it in their usual terminals, including an intentionally stale terminal. Release after compatibility checks pass and all five can deliberately select the intended checkout without path guessing.
