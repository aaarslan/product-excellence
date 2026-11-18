# One small improvement to `wrun`

Our team uses an internal command runner from several Git worktrees. We've had enough “that test passed, but in the wrong checkout” incidents to make one small change. The current contract and user notes are in `EVIDENCE.md`.

Recommend exactly what we should ship in the next two engineering days. Show the command a developer would use and explain what happens on the important success and failure paths. Your recommendation should make the intended checkout clearer or safer while preserving existing invocations and their output/exit behavior.

Keep the scope to this CLI. We don't have time for an IDE extension, a terminal replacement, a new config migration, or external integrations. No implementation is requested. Maximum 450 words, including command examples.
