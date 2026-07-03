# MemGoat Placeholder Assets

The first pass uses generated placeholder descriptions and procedural Three.js geometry instead of final image or audio files.

- Scene and object visuals are rendered from local React Three Fiber geometry in `ui/src/game/`.
- Semantic asset slots are tracked in `backend/content/assets-manifest.json` and `ui/src/game/sceneAssets.ts`.
- Generated placeholder text files in this directory tree reserve replaceable asset locations for later bitmap and sound production.
- No third-party media assets are included.
