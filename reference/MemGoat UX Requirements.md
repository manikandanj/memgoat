# MemGoat: The Cave Echo

UX/Product Requirements Draft v0.2

Status: Product direction aligned; puzzle/content details still subject to playtest  
Submission target: WeMakeDevs x Cognee Hackathon  
Product type: Judge-demo vertical slice  

## 1. Product Goal

MemGoat is an interactive first-person cave escape experience about a goat who forgets everything when a two-minute memory timer expires.

The player discovers that the goat's short-term memory is unreliable, but the cave itself remembers. The Cave Echo stores discovered memories, connects clues, exposes false memories, and eventually reconstructs the goat's identity after the goat forgets again.

The intended judge takeaway is simple:

> The goat forgets. The Cave Echo remembers.

The experience should make external memory feel emotionally necessary, not decorative.

## 2. Experience Strategy

The product is a polished vertical slice designed to be understood in a 5-minute judging demo.

The vertical slice should prioritize:

- A clear emotional hook in the first 30 seconds.
- A visible contrast between the goat's forgetting and the Cave Echo's persistence.
- A prominent countdown timer that creates urgency to capture useful memory before reset.
- A puzzle that cannot be solved from a single clue.
- Active memory capture, where the player must decide what is worth committing to memory.
- A live memory graph/query panel that visibly changes as the player acts.
- One false-memory moment where the player must identify and remove a misleading memory.
- One memory-refinement moment where an earlier clue becomes more specific instead of duplicating.
- A final recall moment where the goat regains identity and purpose through the Cave Echo.

The product should not try to be a full-length game for the hackathon submission. The goal is a memorable, complete proof of experience.

## 3. Target Audience

Primary audience:

- Hackathon judges evaluating creativity, user experience, technical concept, and Cognee fit.

Secondary audience:

- Developers and AI builders who understand the weakness of stateless LLM sessions.
- Players who enjoy atmospheric puzzle games and narrative discovery.

The experience must be understandable without reading a technical README first.

## 4. Core UX Pillars

### 4.1 Memory Is the Main Character

Memory is not a menu, database, inventory, or debug view. It is the central experience.

The player should feel that every examined object changes what the cave knows, what the goat can ask, and what the goat believes about itself.

### 4.2 Forgetting Must Be Felt

The session reset must be an emotional event, not just a timer mechanic.

When the goat forgets, the goat's narration, short-term context, and confidence should reset. The Cave Echo should visibly remain intact.

### 4.3 Graph Traversal Must Be Legible

When the player asks a question, the response should show a connected chain of memories, not just a paragraph.

The player should be able to see relationships such as:

- Cracked locket names Nara.
- Nara connects to the cave's keeper.
- The keeper's remembered name opens the Root Gate.

### 4.4 Doubt Must Be Playable

False memories are part of the experience. The player should encounter a plausible but misleading memory and choose whether to remove it.

The UI must make doubt understandable: the player should see why the false memory is suspicious, what it connects to, and what changes when it is dismissed.

### 4.5 The Ending Must Reframe the Demo

The ending should make the player understand that escaping the cave was not only a spatial goal. It was a memory reconstruction goal.

The final emotional beat:

> I remember.

## 5. Vertical Slice Scope

The vertical slice should include:

- Opening scene.
- First-person interactive cave view.
- Right-side Cave Echo panel with memory graph and query input.
- Prominent two-minute countdown timer.
- 3 playable areas or memory stages.
- 1 complete puzzle chain.
- 1 forced memory reset.
- 1 false memory injection.
- 1 false memory dismissal.
- 1 memory refinement.
- 1 one-way room transition that makes memory retrieval necessary.
- 1 final recall/reconstruction scene.
- Sound effects for memory, urgency, reset, false memory, and success beats.

The vertical slice should not include:

- Top-down player movement.
- Combat.
- Inventory management.
- Character stats.
- Procedural world generation.
- Multiplayer.
- Full five-layer campaign.
- A large quest log.
- A standalone technical dashboard as the primary experience.

## 6. Narrative Flow

### 6.1 Opening

The experience begins on a black screen.

The goat wakes up without identity, location, or objective.

Required opening beats:

1. A voice says the goat has forgotten again.
2. The goat asks who it is.
3. The Cave Echo appears as the only stable source of memory.
4. The player is invited to examine the cave, not given a long tutorial.

The opening should create curiosity within 30 seconds.

The timer should become visible as soon as the player gains control. The player should understand that they have limited time to find and commit something useful before the goat forgets again.

### 6.2 Discovery

The player enters the first interactive cave view and sees several examinable objects.

Each object should feel like part of the world, not a UI prompt placed on top of a blank scene.

Example object types:

- Cracked locket.
- Dead lantern.
- Bronze echo bell.
- Ring of carved names.
- Black mirror pool.
- Witch mark.

Examining an object should not automatically store every possible clue. The player must actively work to turn observation into memory.

The default memory capture flow is:

1. Observe:
   The player selects an object and sees a close first-person inspection view.

2. Interpret:
   The player identifies the meaningful part of the object, such as a symbol, inscription, sound, direction, or contradiction.

3. Commit:
   The player chooses what the Cave Echo should remember.

Committing memory should produce:

- A short sensory description.
- A memory added to the Cave Echo.
- A visible node or connection in the memory graph.
- A changed state on the object so the player knows it has been examined.
- A clear sense that the player made a choice, not that the game automatically stored everything.

Wrong or incomplete commitments are allowed. They should create weaker, suspicious, or misleading memories rather than immediately failing the player.

Uncommitted observations should be lost when the timer expires. If the player noticed something but did not commit it to the Cave Echo, the goat forgets it.

### 6.3 Connection

The player asks the Cave Echo a natural-language question.

The answer should connect discovered memories into a chain.

The query experience should support questions like:

- "Who am I?"
- "How do I open the root gate?"
- "What connects Nara to the lantern?"
- "What does the bell need?"

The response should include:

- A concise answer.
- A highlighted path in the memory graph.
- The underlying memories used to form the answer.
- A clear indication when the Cave Echo does not know enough yet.

### 6.4 Reset

The goat's short-term memory resets during the demo.

Required reset behavior:

- The countdown reaches zero from a default duration of 2:00.
- The goat becomes confused again.
- Recent conversational context disappears from the goat's narration.
- The Cave Echo panel retains discovered memories.
- The player can ask "What do I know?" and recover progress.

The reset should prove the central premise in under 20 seconds.

The timer duration should be configurable for testing and demos, but the product's default experience is a visible two-minute countdown.

The timer must be prominent enough that the player feels urgency. It should not be hidden in small status text.

If the timer expires before the player commits a useful memory, no persistent progress is gained from that memory window. The player may still re-inspect objects in the same room after reset, but must spend time discovering and committing the clue again.

### 6.5 False Memory

The Witch introduces a misleading memory.

The false memory must be plausible, connected to real entities, and harmful if trusted.

Example:

> Your name is Thorn. Nara abandoned you. Speak Thorn and the gate will open.

The false memory should appear in the graph as visually distinct or suspicious, without making the correct action too obvious.

The player must be able to inspect it, question it, and dismiss it.

Dismissal should:

- Ask for confirmation if the action is irreversible in the current run.
- Remove or mark the false branch.
- Update future recall results.
- Make the graph visibly cleaner.

### 6.6 Memory Refinement

At least one later discovery must refine an earlier memory.

The player should see that the Cave Echo did not create a duplicate concept. It improved the existing understanding.

Example progression:

1. Nara is a name on the cracked locket.
2. Nara may be connected to the cave's keeper.
3. Nara was the keeper who carried the dead lantern.
4. Nara is the goat's forgotten identity.

The UI should show the changed memory as an evolution of the same node or relationship.

### 6.7 Final Recall

At the end of the vertical slice, the goat forgets once more.

The player asks the Cave Echo what the goat knows.

The memory graph lights up and reconstructs:

- Identity.
- Place.
- Key objects.
- Puzzle chain.
- Mistake/false memory.
- Correct path forward.

The goat should then remember enough to open the Root Gate.

Required ending beat:

> I was not escaping the cave. I was escaping forgetfulness.

### 6.8 One-Way Room Progression

The cave should support one-way forward movement.

Within the current room, the player may inspect objects again before or after a reset. Once the player moves deeper into the cave, they cannot physically return to previous rooms.

This rule makes the Cave Echo necessary:

- The player can revisit current-room objects before leaving.
- A reset does not force the player out of the current room.
- The player cannot go back to earlier rooms after crossing a threshold.
- Memories from previous rooms are only available through the Cave Echo.
- The player must rely on recall instead of physically rechecking old clues.

Room exits should clearly warn the player before they commit to moving forward.

The one-way rule should feel like part of the cave fiction, such as a collapsing passage, sealing stone door, rising water, or shifting cave wall.

## 7. Primary Screen Layout

The main experience uses a two-zone layout.

### 7.1 Left Zone: First-Person Cave

The left side is the interactive cave view.

Requirements:

- First-person perspective, not top-down.
- The player looks into a cave room or chamber.
- Examinable objects are visually embedded in the scene.
- Hover/focus states identify objects without cluttering the scene.
- Examined objects visibly change state.
- Important world changes should happen in the cave view, not only in the memory panel.

The cave should feel atmospheric, but clarity is more important than visual complexity.

Visual style decision:

- The vertical slice should use a painterly first-person cave style.
- Scenes may be illustrated stills or lightly animated painterly views with interactive hotspots.
- The style should prioritize readable objects, strong silhouettes, and clear lighting over visual density.
- The goat does not need to be fully visible during normal play; its presence can come through voice, breath, hooves, shadow, and occasional reflection.

### 7.2 Right Zone: Cave Echo Panel

The right side is the player's interface to persistent memory.

Required panel sections:

- Prominent countdown timer or paired timer display.
- Current memory graph or memory tree.
- Natural-language question input.
- Last recall result.
- Currently selected memory/object details.
- Action area for dismissing or inspecting suspicious memories.
- Reset/session state indicator.

The panel should feel like an in-world artifact or ancient memory instrument, not a developer console.

### 7.3 Responsive Behavior

Desktop is the primary target for the hackathon demo.

On narrower screens, the cave view and Cave Echo panel may stack vertically. The memory graph must remain readable enough to understand the demo.

## 8. Player Actions

### 8.1 Examine

The player examines an object in the cave.

Requirements:

- The action must feel like the goat perceiving the world.
- Examination opens a short inspection state instead of immediately storing all information.
- Each examinable object should contain at least one meaningful detail the player can choose to commit.
- Some objects may contain partial truths, weak clues, or red herrings.
- The Cave Echo visibly adds or updates memory only after the player commits a memory.
- The player should receive immediate feedback that the chosen memory was stored.
- The object should show an examined state.
- The flow should be fast enough to preserve timer pressure.

The intended interaction is Observe -> Interpret -> Commit.

Decision:

- The first release uses timer pressure and memory-commit choices instead of a fixed "3 examines per reset" limit.
- Memory capture starts simple: inspect an object, then choose from 2-3 candidate interpretations.
- Some candidate interpretations may be incomplete or misleading.
- Hotspot discovery and harder interpretation rules are reserved for later if initial playtests show the loop is too easy.

### 8.2 Commit Memory

The player decides what should be added to the Cave Echo.

Requirements:

- The player chooses the memory from 2-3 candidate interpretations.
- Free-form commit text is not required for the first release.
- Candidate interpretations should include at least one tempting but incomplete or misleading option when appropriate.
- The chosen memory should appear immediately in the graph.
- The source object should remain linked to the committed memory.
- The player should be able to inspect the memory later and see what object or moment created it.

### 8.3 Ask the Cave Echo

The player asks a natural-language question.

Requirements:

- The input should accept ordinary player questions.
- The result should answer through connected memories.
- The graph should highlight the relevant path.
- The response should distinguish known facts from uncertain or incomplete memories.
- If not enough is known, the UI should suggest what category of memory may be missing without giving away the answer.

### 8.4 Inspect Memory

The player can select a memory node or relationship.

Requirements:

- The selected memory shows its source object or scene.
- The selected memory shows related nodes.
- The selected memory shows whether it is new, reinforced, refined, suspicious, or dismissed.

### 8.5 Dismiss Memory

The player can dismiss a suspected false memory.

Requirements:

- Dismissal should be available only from an inspected memory.
- The product should make the consequence clear.
- The graph should update immediately.
- Future answers should no longer rely on the dismissed memory.

### 8.6 Recover After Reset

After the goat forgets, the player uses the Cave Echo to recover.

Requirements:

- The goat's narration should show confusion.
- The player should be able to ask a broad recovery question.
- The Cave Echo should reconstruct enough context to continue.
- The experience should not force the player to manually re-examine all prior objects.

## 9. Memory Graph UX

The memory graph is the clearest proof that the Cave Echo is doing meaningful work.

Requirements:

- Nodes should represent meaningful memories, not raw log lines.
- Edges should represent relationships such as leads to, opens, contradicts, refines, or belongs to.
- Important query results should animate or highlight paths through the graph.
- False memories should be visually distinguishable after suspicion or inspection.
- Refined memories should preserve continuity with earlier discoveries.
- The graph should be readable during a live demo without requiring zooming or expert explanation.

Suggested memory categories:

- Identity.
- Places.
- Objects.
- People/voices.
- Causes.
- Questions.
- Mistakes/false memories.

## 10. Puzzle Requirements

The vertical slice puzzle must require connected memory.

Requirements:

- No single clue should solve the puzzle.
- The correct path should require at least three connected memories.
- At least one clue should be incomplete until refined later.
- At least one clue should be misleading but plausible.
- The final recall should use memories from multiple moments in the demo.
- The player should be able to reason about what to ask next from visible world cues.
- The puzzle should account for one-way room progression: earlier clues cannot be physically revisited after leaving a room.
- The puzzle should require at least one committed memory from an earlier room to solve a later room.

Puzzle content should be authored as a repository of possible chains. The first release needs one complete chain. Additional chains can be added if time allows without changing the core player experience.

### 10.1 Puzzle Chain Repository Model

Each puzzle chain should be authored as a self-contained content module.

Each chain module should define:

- Rooms.
- One-way transitions.
- Objects.
- Candidate memory interpretations.
- Correct committed memories.
- Incomplete or misleading memories.
- False memory injection.
- Refinement moment.
- Final recall question.
- Expected graph path.
- Final player-facing resolution.

The first release should ship one chain only. The system should be content-extensible later, but the UX requirements are scoped around one polished chain.

### 10.2 First Chain: The Last Lantern

This is the first real vertical-slice puzzle chain.

Core premise:

The final gate does not open to a key, color, or object. It opens when the goat reconstructs who it was and why it entered the cave.

Required rooms:

1. Waking Chamber.
2. Bell Gallery.
3. Root Gate.

Room 1: Waking Chamber

Purpose:

- Teach observe -> interpret -> commit.
- Establish identity as a recoverable memory.
- Create a clue the player cannot physically revisit after leaving.

Objects:

- Cracked locket.
- Dead lantern.
- Scratched wall.

Correct memory commitments:

- The locket belonged to someone named Nara.
- The dead lantern was carried by the cave's keeper.
- The scratched wall says "a keeper remembers the way for others."

Misleading or incomplete commitments:

- Nara was another prisoner.
- The lantern is only a light source.
- The scratched wall is a warning to leave quickly.

Room 1 exit:

- The player crosses a stone threshold that seals behind them.
- After this point, the locket and wall cannot be physically rechecked.

Room 2: Bell Gallery

Purpose:

- Make previous-room memory necessary.
- Introduce relationship-based recall.
- Create the first refinement.

Objects:

- Bronze echo bell.
- Ring of carved names.
- Broken lantern hook.

Correct memory commitments:

- The bell carries remembered names deeper into the cave.
- The keeper's lantern hangs from the bell hook.
- A remembered name can wake a sealed path.

Refinement:

- "Nara" is refined from a name on a locket into the likely name of the cave's keeper.

Required recall:

- The player asks a question such as "What does the bell need?" or "What do I know about Nara?"
- The Cave Echo connects Nara -> keeper -> lantern -> bell.

Room 2 exit:

- Ringing the bell opens a path forward, then the gallery falls silent and cannot be re-entered.

Room 3: Root Gate

Purpose:

- Introduce false memory.
- Force dismissal.
- Resolve identity and escape.

Objects:

- Root-covered gate.
- Black mirror pool.
- Witch mark.

False memory injection:

- The Witch claims: "Your name is Thorn. Nara abandoned you. Speak Thorn and the gate will open."

Correct memory commitments:

- The root gate listens for the keeper's true name.
- The black mirror shows the goat carrying the dead lantern as Nara.
- The Witch mark contradicts the locket and bell memories.

Dismissal:

- The player inspects the false "Thorn" memory, sees that it has no trustworthy source object, and dismisses it.

Final recall question:

- "Who am I?"
- "How do I open the root gate?"
- "What name should the gate hear?"

Expected graph path:

- Cracked locket -> Nara.
- Scratched wall -> keeper.
- Dead lantern -> keeper's lantern.
- Bell hook -> lantern belongs at the bell.
- Echo bell -> remembered names open sealed paths.
- Black mirror -> goat was Nara.
- Root gate -> true keeper name opens the exit.

Final resolution:

- The Cave Echo reconstructs that the goat was Nara, the cave's keeper.
- The goat speaks the remembered name.
- The lantern lights.
- The root gate opens.

## 11. Demo Script Requirements

The product should support a reliable 5-minute demo.

Required demo beats:

1. Start with the goat confused.
2. Show the two-minute timer starting.
3. Inspect an identity clue and commit one chosen memory.
4. Inspect an environmental clue and commit one chosen memory.
5. Show memories appearing in the Cave Echo.
6. Move forward through a one-way room transition.
7. Ask a question that depends on an earlier room's memory.
8. Trigger or wait for a memory reset.
9. Ask "What do I know?" and recover prior context.
10. Examine a clue that refines an earlier memory.
11. Introduce a false memory.
12. Inspect and dismiss the false memory.
13. Ask how to reach the exit.
14. Show the final chain.
15. End with the goat remembering itself.

The demo must still make sense if run manually by a judge, not only by the presenter.

Demo reliability decision:

- The product must run with a real visible two-minute timer.
- The judge demo may include a presenter-controlled reset trigger or timer fast-forward for reliability.
- Any scripted reset must still appear as the same in-world memory reset, not as a debug command.

## 12. UX Quality Requirements

### 12.1 Clarity

- The player should always know what can be examined.
- The player should always know how much time remains before reset.
- The player should understand when an observation has not yet been committed to memory.
- The player should always know whether the Cave Echo knows enough to answer.
- The player should understand when the goat forgot versus when the Cave Echo remembered.

### 12.2 Pace

- The opening should take less than 30 seconds.
- The first memory should be created within 60 seconds.
- The timer should default to 2 minutes per memory window.
- The reset/recovery proof should happen within the first 3 minutes of the demo.
- The full vertical slice should be completable in 5 to 7 minutes.

### 12.3 Tone

- Atmospheric, mysterious, and emotionally clear.
- Light surrealism is acceptable.
- The UX should avoid parody or excessive exposition.
- The goat may be vulnerable, curious, or quietly funny, but should not undercut the central memory metaphor.

### 12.4 Error and Empty States

- If the Cave Echo cannot answer, it should say what is missing in-world.
- Loading states should preserve immersion.
- Failed or incomplete answers should not expose raw technical errors.
- The player should never be stuck because they phrased a question slightly differently.

### 12.5 Accessibility

- Text must be readable during screen sharing.
- Important state changes must not rely only on color.
- The experience should be usable with mouse and keyboard.
- The timer/reset should be understandable through text and visual state.
- Sound effects should have visual equivalents or captions for critical story and state changes.

## 13. Sound Requirements

Sound is part of the product experience, not polish to add only at the end.

The vertical slice should include distinct sound cues for:

- Timer start.
- Timer warning near expiration.
- Memory committed to the Cave Echo.
- Recall path revealed.
- Memory refined.
- False memory introduced.
- False memory dismissed.
- Room transition sealing behind the player.
- Goat memory reset.
- Final reconstruction/door opening.

Sound direction:

- Cave ambience should be realistic, subtle, and spatial.
- The Cave Echo should use mystical memory tones that are recognizable but not overpowering.
- UI feedback should use clear game-like confirmation sounds for memory commit, recall, dismissal, and success.
- The Witch should sound intrusive or wrong compared with the Cave Echo.
- Timer urgency should increase without becoming annoying during repeated demos.

Sound UX requirements:

- Critical sounds must be paired with visual feedback.
- The experience should support muted playback without breaking comprehension.
- Volume levels should not obscure narration or memory text.

## 14. Content Requirements

### 14.1 Voice and Copy

The copy should be concise.

The goat's voice:

- Short sentences.
- Confused after reset.
- More grounded after recall.
- Avoids technical terminology.

The Cave Echo's voice:

- Ancient but clear.
- Gives structured memory, not long monologues.
- Distinguishes memory from certainty.

The Witch's voice:

- Persuasive.
- Brief.
- Plants doubt through false certainty.

### 14.2 In-Game Naming

The persistent memory layer is called:

> The Cave Echo

The product may reference Cognee in submission materials, README, demo narration, and technical explanations, but not as the in-world name during play.

## 15. Success Criteria

The UX succeeds if a judge can say:

- I understood why the goat forgot.
- I saw that the Cave Echo remembered across resets.
- I felt pressure from the timer.
- I had to choose what was worth remembering.
- I relied on the Cave Echo because I could not return to an earlier room.
- I saw memories become a graph, not a flat list.
- I saw a wrong memory affect the experience.
- I saw the player remove or correct memory.
- I understood why this is more than a chatbot or normal game inventory.
- I remember the ending.

## 16. Product Decisions

These decisions are locked for the first vertical slice unless playtesting shows a clear problem.

1. Memory capture difficulty:
   Keep the first release simple. The player chooses from 2-3 candidate interpretations after inspecting an object. Hotspot discovery and harder interpretation rules are extensibility options after initial playtesting.

2. Exact puzzle chain:
   Use "The Last Lantern" as the first real chain. Author future chains as content modules using the repository model in section 10.1.

3. Visual style:
   Use a painterly first-person cave style with readable interactive hotspots.

4. Reset timing:
   Use a prominent two-minute timer as the real product behavior. Support presenter-controlled reset or timer fast-forward for demo reliability if needed.

5. Dismissal consequence:
   A dismissed false memory is removed for the run. A dismissed memory with a real source can be rediscovered only if the player can still physically access the source object. Since previous rooms become inaccessible, dismissing a real earlier memory is consequential.

6. Final line:
   Keep "I was not escaping the cave. I was escaping forgetfulness." for the first playable demo.

7. Sound style:
   Use all three layers together: realistic cave ambience, mystical Cave Echo tones, and restrained game-like feedback sounds.
