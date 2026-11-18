# Notes from three kitchen-table uses

These are observations, not a feature specification.

- The first child stared at the three prompts for about 40 seconds, then asked, “What do I do first?” An adult suggested saying one sentence aloud. That got the story moving.
- The younger child liked the fox and the train station, but didn't know what to do with the missing shadow. They pressed “Deal cards” again and were disappointed to lose all three cards.
- The older child wrote a funny opening about the gardener. When the countdown got low, they stopped to watch it and said, “I was still thinking.” On another day, both children asked for a timed round.
- One child wrote a complete four-sentence story. The editor still looked like unfinished work. The family read directly from the cramped text box because there wasn't an obvious finished version to share.
- The saved list contains dates and the first few words of each story. The children had trouble finding the “tiny dragon one” from the previous day.
- An adult clicked “New story” while helping with a word and erased an unsaved ending. The child didn't want to start again.
- A sibling deleted a saved story while trying to open it. The family couldn't recover it.
- The older child said, “Please don't make everything babyish.” Both children liked the unexpected prompt combinations. Neither asked for scores, prizes, or a competitive mode.

## Existing data

The prototype uses these `localStorage` keys:

- `storybreak.draft.v1`: an object with `prompt`, `text`, and `updatedAt`.
- `storybreak.stories.v1`: an array of saved story objects with `id`, `title`, `prompt`, `text`, and `createdAt`.

`prompt` contains three strings: `character`, `place`, and `trouble`. Timestamps are ISO strings. `sample-storage.json` is an anonymized old snapshot for checking compatibility; don't load it into every new visitor's library by default.

The prompt words in the prototype are editable material, not a protected taxonomy. Saved stories may contain prompts no longer present in the current deck. Keep that old text intact.

## Practical limits

The laptop sometimes has no internet. The family shares its browser profile. We are comfortable with ordinary local browser storage and understand that clearing browser data removes it. A normal session is one short story, sometimes followed by reading an older one aloud. Nobody wants setup before the first story.
