# Existing runner contract

`wrun <task> [-- <args...>]` finds the Git worktree containing the current working directory, loads that worktree's `.wrun.json`, and executes the named task from that worktree's root. The config maps task names to argument arrays, such as `["npm", "test"]`. Arguments after `--` are passed to the task unchanged. No shell string evaluation is used.

`wrun --repo <path> <task> [-- <args...>]` already selects an explicit worktree root. It accepts a root path, not a branch name. Existing users rely on this option.

For existing invocations, stdout and stderr are the child's streams without runner banners, and the exit status is the child's status. A task that intentionally exits 1 still exits 1. Existing runner errors use stderr and exit 2. Automation depends on these contracts, even when a command happens to run in a terminal.

The new version must keep those existing invocations, configuration files, streams, and status behavior. New opt-in syntax may add its own documented behavior. Existing flags may not be reinterpreted. No global config migration or default confirmation prompt.

The CLI may inspect Git metadata and list the existing worktrees of the current repository. It must not switch branches, create or remove worktrees, modify Git refs, install dependencies, or search arbitrary directories outside that repository's worktree list. It can execute from a deliberately selected existing worktree, as `--repo` already does. Don't assume there is an issue-tracker integration or a branch naming convention.

## Incidents and comments

- An engineer copied `wrun test -- --runInBand` into an older terminal. The tests passed, but the terminal was in the previous worktree. They noticed only when a teammate couldn't reproduce the result.
- A developer often has three sibling worktrees with similar folder names. Two terminals can have the same short folder name in their prompt. The developer remembers the branch name more readily than its full path.
- Another developer uses a detached-HEAD worktree to reproduce a customer release. Branch names alone won't identify every valid worktree.
- A branch can be renamed or a worktree can disappear between looking it up and starting a command. A failed selection must not quietly run in the current directory instead.
- CI captures test output verbatim. An earlier proposal to print a helpful location banner on every invocation was rejected because it altered the contract.
- A teammate suggested “just show a warning.” In a quick trial, people hit Enter through warnings once they became routine.
- Someone proposed a new `--branch` flag. That's an idea, not an agreed feature. We already have `--repo`, so an additional selector needs to earn its place.

There is no usage telemetry. We can ask five engineers to try the change in their normal work. We can run a few focused compatibility and failure-path checks before release.
