# Goat of the Witch-Cave — Static Prototype

This updated prototype is built as a replaceable-asset, static HTML/CSS/JS demo.

## What changed
- Scene assets now render directly in-world with low-opacity blending and only visibly stand out on hover.
- First-person narration focus (the goat is **not** rendered on screen).
- A plot / intro screen before play begins.
- A stronger room theme based on the dark ritual-cave references.
- Hover-highlighted clickable hotspots over the environment.
- Inspect popup for every clickable object, with description and clue text.
- More clues and a clearer deduction system.
- A new mechanic: **Memory Knots**.
  - Click objects to collect temporary clue fragments.
  - Open **Clue Box** and weave available clue threads into persistent deductions.
  - Temporary clues reset every 2 minutes.
  - Solved deductions persist through resets and unlock progress.
- Cave Voice hint panel.
- Audio hooks for future ambient music / SFX.

## Replaceable asset structure
Swap these files freely without breaking core logic:
- `assets/bg_shard_hollow.png`
- `assets/clue_ritual_bowl.png`
- `assets/clue_eye_shard.png`
- `assets/clue_scratch_marks.png`
- `assets/clue_kael_niche.png`
- `assets/clue_blue_fissure.png`
- `assets/clue_ash_ring.png`
- `assets/clue_ward_cloth.png`

## Add audio later
Optional:
- add `assets/audio/ambient-cave.mp3`
- you can also wire more SFX inside `script.js`

## Prototype flow
1. Enter the cave.
2. Inspect highlighted objects.
3. Commit clues to short-term memory.
4. Open Clue Box.
5. Weave valid clue threads into persistent Memory Knots.
6. Use deductions to reveal the hidden name niche and then the final escape passage.

## Notes
- This is structured as a **prototype room** with scalable logic.
- You can add more rooms later by extending the data in `script.js`.
- The popup / hotspot / clue-thread system is already organized to be asset-replaceable.
