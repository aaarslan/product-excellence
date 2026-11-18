# Contributing

Help make the skill more useful without making it heavier.

## Report an experience

Open an issue with the task you gave the agent, the skill version or commit, the host/model if known, and what happened. Include the smallest shareable example of the output. Explain what was useful, what got in the way, and what you expected instead. Remove private information and credentials.

A concrete failure is especially helpful: a needless redesign, a generic concept, a beautiful but unusable result, lost functionality, or a claim the agent did not verify. A case where the skill added no value is useful too.

## Propose a change

1. Explain the recurring problem and show an example.
2. Change the smallest part of the instructions that addresses it.
3. Try the revision on a fresh task, alongside the current skill when possible. Keep the task and tools comparable; retain both outputs, including disappointing results.
4. Open a pull request with the change, observed effect, and limitations.

Judge what the user can understand, do, or enjoy. Do not reward an answer merely for repeating the skill's wording. Separate working code, visual inspection, and real-user feedback. A persuasive example is not a general performance claim.

Keep `product-excellence/SKILL.md` self-contained and concise. The installable folder should not depend on research or evaluation files elsewhere in the repository. Keep examples and studies outside it, preserve existing evidence, and avoid adding runtime packages or automation without a demonstrated need.

See [the evaluation method](EVALUATION.md) and [research rationale](RESEARCH.md). Contributions are covered by the repository's [MIT license](LICENSE); retain separate notices for any third-party material.
