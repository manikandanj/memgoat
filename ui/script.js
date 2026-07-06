const API_BASE = window.MEMGOAT_API_BASE || 'http://127.0.0.1:8000';
const TITLE_HOLD_MS = 3500;
const NARRATION_CUES = [0, 12, 20, 45];
const BG_MUSIC_GAIN = 1.5;

const ROOM_SKIN = {
  'waking-chamber': {
    title: 'Waking Chamber',
    subtitle: 'A low stone room where the goat wakes beside a dead lantern and a sealing threshold.',
    goal: 'Inspect the chamber and choose what the Cave Echo should remember.',
    bg: 'assets/bg_shard_hollow.png',
    intro: 'Cold stone. A dead lantern. The cave is already taking pieces of me.',
    positions: {
      locket: { x: 28, y: 50, w: 12, h: 14, image: 'assets/clue_eye_shard.png' },
      dead_lantern: { x: 44, y: 60, w: 12, h: 16, image: 'assets/clue_ritual_bowl.png' },
      scratched_wall: { x: 65, y: 30, w: 12, h: 18, image: 'assets/clue_scratch_marks.png' }
    }
  },
  'bell-gallery': {
    title: 'Bell Gallery',
    subtitle: 'Bronze bells hang from roots, each etched with a name that almost rings true.',
    goal: 'Use the Echo-held memories to refine Nara and carry the lantern forward.',
    bg: 'assets/cave_bg.png',
    intro: 'The room behind me seals. The bell ahead waits for a name I nearly forgot.',
    positions: {
      echo_bell: { x: 28, y: 34, w: 13, h: 18, image: 'assets/clue_blue_fissure.png' },
      ring_of_names: { x: 45, y: 62, w: 20, h: 15, image: 'assets/clue_ash_ring.png' },
      lantern_hook: { x: 67, y: 36, w: 11, h: 18, image: 'assets/clue_ward_cloth.png' }
    }
  },
  'root-gate': {
    title: 'Root Gate',
    subtitle: 'A door of roots knots around a black mirror pool and a mark that lies beautifully.',
    goal: 'Commit the final truths, distrust the false memory, and ask the Cave Echo who you are.',
    bg: 'assets/bg_shard_hollow.png',
    intro: 'Roots tighten around the gate. Something here wants the wrong story to survive.',
    positions: {
      root_gate: { x: 44, y: 25, w: 18, h: 24, image: 'assets/bricks.png' },
      mirror_pool: { x: 25, y: 62, w: 18, h: 14, image: 'assets/clue_eye_shard.png' },
      witch_mark: { x: 68, y: 48, w: 12, h: 18, image: 'assets/clue_scratch_marks.png' }
    }
  }
};

const DEFAULT_HOTSPOTS = [
  { x: 26, y: 52, w: 12, h: 14, image: 'assets/clue_ritual_bowl.png' },
  { x: 46, y: 56, w: 12, h: 14, image: 'assets/clue_eye_shard.png' },
  { x: 66, y: 40, w: 12, h: 18, image: 'assets/clue_scratch_marks.png' }
];

const el = {
  sceneItems: document.getElementById('sceneItems'),
  roomTitle: document.getElementById('roomTitle'),
  roomSubtitle: document.getElementById('roomSubtitle'),
  goalText: document.getElementById('goalText'),
  narration: document.getElementById('narration'),
  timer: document.getElementById('timer'),
  timerWrap: document.getElementById('timerWrap'),
  progressValue: document.getElementById('progressValue'),
  narrationOverlay: document.getElementById('narrationOverlay'),
  introTitleImage: document.querySelector('.intro-title-image'),
  narrationPictures: Array.from(document.querySelectorAll('.narration-picture')),
  narrationStartBtn: document.getElementById('narrationStartBtn'),
  skipIntroBtn: document.getElementById('skipIntroBtn'),
  narrationAudio: document.getElementById('narrationAudio'),
  introOverlay: document.getElementById('introOverlay'),
  startBtn: document.getElementById('startBtn'),
  plotBtn: document.getElementById('plotBtn'),
  clueDialog: document.getElementById('clueDialog'),
  cluesBtn: document.getElementById('cluesBtn'),
  closeClues: document.getElementById('closeClues'),
  clueList: document.getElementById('clueList'),
  connectionList: document.getElementById('connectionList'),
  threadGrid: document.getElementById('threadGrid'),
  fragmentCount: document.getElementById('fragmentCount'),
  knotCount: document.getElementById('knotCount'),
  stateValue: document.getElementById('stateValue'),
  inspectDialog: document.getElementById('inspectDialog'),
  closeInspect: document.getElementById('closeInspect'),
  inspectImage: document.getElementById('inspectImage'),
  inspectType: document.getElementById('inspectType'),
  inspectTitle: document.getElementById('inspectTitle'),
  inspectBlurb: document.getElementById('inspectBlurb'),
  inspectObservation: document.getElementById('inspectObservation'),
  inspectClue: document.getElementById('inspectClue'),
  inspectTags: document.getElementById('inspectTags'),
  memoryChoices: document.getElementById('memoryChoices'),
  rememberBtn: document.getElementById('rememberBtn'),
  actBtn: document.getElementById('actBtn'),
  voiceBtn: document.getElementById('voiceBtn'),
  voicePanel: document.getElementById('voicePanel'),
  closeVoice: document.getElementById('closeVoice'),
  chatLog: document.getElementById('chatLog'),
  chatForm: document.getElementById('chatForm'),
  chatInput: document.getElementById('chatInput'),
  toast: document.getElementById('toast'),
  musicBtn: document.getElementById('musicBtn'),
  endingOverlay: document.getElementById('endingOverlay'),
  endingText: document.getElementById('endingText'),
  restartBtn: document.getElementById('restartBtn'),
  bgMusic: document.getElementById('bgMusic'),
  swooshSound: document.getElementById('swooshSound'),
  caveBg: document.querySelector('.cave-bg')
};

const state = {
  session: null,
  room: null,
  graph: { nodes: [], edges: [], memories: [] },
  inspection: null,
  selectedHotspot: null,
  timeLeft: 120,
  running: false,
  ended: false,
  musicOn: true,
  introStarted: false,
  narrationComplete: false,
  narrationTimers: [],
  tickHandle: null
};

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(detail.detail || response.statusText);
  }
  return response.json();
}

async function startGame() {
  el.introOverlay.classList.add('hidden');
  await guarded('Opening the cave...', async () => {
    state.session = await api('/api/sessions', { method: 'POST' });
    state.timeLeft = state.session.timer_seconds;
    state.running = true;
    state.ended = false;
    await refreshAll();
    showToast('Session opened. The backend is carrying memory state.');
    startBackgroundSound();
  });
}

async function beginNarration() {
  if (state.narrationComplete || state.introStarted || !el.narrationOverlay) return;
  state.introStarted = true;
  el.narrationOverlay.classList.add('title-hold');
  el.narrationStartBtn.disabled = true;
  window.setTimeout(startNarrationAudio, TITLE_HOLD_MS);
}

async function startNarrationAudio() {
  if (state.narrationComplete || !el.narrationOverlay) return;
  el.narrationOverlay.classList.remove('title-stage', 'title-hold');
  el.narrationOverlay.classList.add('playing');
  showNarrationPicture(0);
  scheduleNarrationPictures();
  try {
    await el.narrationAudio.play();
  } catch (error) {
    el.narrationOverlay.classList.remove('playing');
    el.narrationOverlay.classList.add('title-stage');
    el.narrationStartBtn.disabled = false;
    el.narrationStartBtn.textContent = 'Begin';
    clearNarrationTimers();
    state.introStarted = false;
  }
}

async function finishNarration(options = {}) {
  if (state.narrationComplete) return;
  state.narrationComplete = true;
  clearNarrationTimers();
  el.narrationAudio.pause();
  el.narrationAudio.currentTime = 0;
  if (!options.skip) {
    showNarrationPicture(3);
    el.narrationOverlay.classList.add('dramatic-entry');
    await delay(2200);
  }
  document.body.classList.remove('narration-active');
  el.introOverlay.classList.add('hidden');
  await startGame().catch(() => {});
  el.introOverlay.classList.remove('current-page-pending');
  el.narrationOverlay.classList.add('done');
  setTimeout(() => {
    el.narrationOverlay.hidden = true;
  }, 1900);
}

function skipIntro() {
  finishNarration({ skip: true });
}

function scheduleNarrationPictures() {
  clearNarrationTimers();
  NARRATION_CUES.slice(1).forEach((cueSeconds, index) => {
    state.narrationTimers.push(window.setTimeout(() => {
      showNarrationPicture(index + 1);
    }, cueSeconds * 1000));
  });
}

function clearNarrationTimers() {
  state.narrationTimers.forEach(timer => window.clearTimeout(timer));
  state.narrationTimers = [];
}

function showNarrationPicture(index) {
  el.narrationPictures.forEach((picture, pictureIndex) => {
    picture.classList.toggle('active', pictureIndex === index);
  });
}

async function refreshAll() {
  if (!state.session) return;
  const [session, room, graph] = await Promise.all([
    api(`/api/sessions/${state.session.id}`),
    api(`/api/sessions/${state.session.id}/room`),
    api(`/api/sessions/${state.session.id}/echo/graph`)
  ]);
  state.session = session;
  state.room = room;
  state.graph = graph;
  state.timeLeft = Math.min(state.timeLeft || session.timer_seconds, session.timer_seconds);
  renderRoom();
  renderScene();
  renderClueBox();
  updateProgress();
  updateTimer();
}

function renderRoom() {
  const skin = getSkin();
  el.roomTitle.textContent = state.room?.title || skin.title;
  el.roomSubtitle.textContent = state.room?.summary || skin.subtitle;
  el.goalText.textContent = goalText();
  el.narration.textContent = state.room?.goat_context || skin.intro;
  if (el.caveBg) {
    el.caveBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.52)), url('${skin.bg}')`;
  }
}

function renderScene() {
  el.sceneItems.innerHTML = '';
  if (!state.room) return;
  state.room.hotspots.forEach((hotspot, index) => {
    const visual = getHotspotVisual(hotspot, index);
    const btn = document.createElement('button');
    btn.className = 'hotspot';
    if (hotspot.examined) btn.classList.add('found');
    btn.style.left = `${visual.x}%`;
    btn.style.top = `${visual.y}%`;
    btn.style.width = `${visual.w}%`;
    btn.style.height = `${visual.h}%`;
    btn.style.borderRadius = visual.radius || '12px';
    btn.innerHTML = `
      <span class="hotspot-asset-wrap">
        <img class="hotspot-asset" src="${visual.image}" alt="" aria-hidden="true" />
      </span>
      <span class="hotspot-label">${escapeHtml(hotspot.label)}</span>
      <span class="hotspot-status">${hotspot.examined ? '*' : '.'}</span>
    `;
    btn.addEventListener('click', () => openInspect(hotspot.id));
    el.sceneItems.appendChild(btn);
  });
}

async function openInspect(id) {
  playSwoosh();
  await guarded('Inspecting object...', async () => {
    state.selectedHotspot = id;
    state.inspection = await api(`/api/sessions/${state.session.id}/objects/${id}/inspect`, { method: 'POST' });
    const hotspot = state.room.hotspots.find(item => item.id === id);
    const visual = getHotspotVisual(hotspot, state.room.hotspots.indexOf(hotspot));
    el.inspectImage.src = visual.image;
    el.inspectTitle.textContent = state.inspection.label;
    el.inspectType.textContent = hotspot?.kind || 'Cave object';
    el.inspectBlurb.textContent = state.inspection.prompt;
    el.inspectObservation.textContent = state.inspection.observation;
    el.inspectClue.textContent = 'Choose the memory that should survive the next reset.';
    el.inspectTags.innerHTML = state.inspection.candidates
      .map(candidate => `<span class="tag">${escapeHtml(candidate.status)} / ${Math.round(candidate.confidence * 100)}%</span>`)
      .join('');
    renderMemoryChoices();
    el.rememberBtn.hidden = false;
    el.rememberBtn.disabled = !state.inspection.candidates.length;
    el.rememberBtn.textContent = 'Commit strongest memory';
    el.actBtn.hidden = true;
    el.inspectDialog.showModal();
  });
}

function renderMemoryChoices() {
  el.memoryChoices.innerHTML = '';
  state.inspection.candidates.forEach(candidate => {
    const card = document.createElement('article');
    card.className = 'thread-card';
    card.innerHTML = `
      <h4>${escapeHtml(candidate.title)}</h4>
      <p>${escapeHtml(candidate.text)}</p>
      <div class="thread-meta">${escapeHtml(candidate.category)} / ${escapeHtml(candidate.status)} / ${Math.round(candidate.confidence * 100)}% confidence</div>
      <button class="stone-btn" type="button">Commit this memory</button>
    `;
    card.querySelector('button').addEventListener('click', () => commitMemory(candidate.id));
    el.memoryChoices.appendChild(card);
  });
}

async function rememberSelected() {
  if (!state.inspection?.candidates?.length) return;
  const best = [...state.inspection.candidates].sort((a, b) => b.confidence - a.confidence)[0];
  await commitMemory(best.id);
}

async function commitMemory(candidateId) {
  await guarded('Committing memory...', async () => {
    await api(`/api/sessions/${state.session.id}/memories/commit`, {
      method: 'POST',
      body: JSON.stringify({ object_id: state.inspection.object_id, candidate_id: candidateId })
    });
    el.inspectDialog.close();
    await refreshAll();
    showToast('Memory committed to the Cave Echo.');
  });
}

async function exitCurrentRoom() {
  if (!state.room?.exits?.length) return;
  await guarded('Crossing the threshold...', async () => {
    const nextRoom = await api(`/api/sessions/${state.session.id}/rooms/${state.room.id}/exit`, { method: 'POST' });
    state.room = nextRoom;
    state.inspection = null;
    state.timeLeft = state.session.timer_seconds;
    await refreshAll();
    showToast('The previous chamber sealed behind you.');
  });
}

async function askEcho(question) {
  await guarded('Asking the Cave Echo...', async () => {
    const recall = await api(`/api/sessions/${state.session.id}/echo/ask`, {
      method: 'POST',
      body: JSON.stringify({ question })
    });
    addBubble(recall.answer, 'cave');
    if (recall.final_line) {
      state.ended = true;
      state.running = false;
      el.endingText.textContent = recall.final_line;
      el.endingOverlay.hidden = false;
    }
    await refreshAll();
  });
}

async function resetMemoryCycle() {
  if (!state.session) return;
  await guarded('The memory tide resets...', async () => {
    state.session = await api(`/api/sessions/${state.session.id}/reset`, { method: 'POST' });
    state.timeLeft = state.session.timer_seconds;
    await refreshAll();
    showToast('Reset complete. Committed memories persisted.');
  });
}

function renderClueBox() {
  const memories = state.graph.memories || [];
  const nodes = state.graph.nodes || [];
  const roomMemories = state.room ? memories.filter(memory => memory.room_id === state.room.id) : memories;
  el.clueList.innerHTML = roomMemories.length
    ? roomMemories.map(memory => `<li><strong>${escapeHtml(memory.title)}:</strong> ${escapeHtml(memory.text)}</li>`).join('')
    : '<li class="empty">No memories committed in this chamber yet.</li>';
  el.connectionList.innerHTML = memories.length
    ? memories.map(memory => `<li><strong>${escapeHtml(memory.title)}:</strong> ${escapeHtml(memory.status)}</li>`).join('')
    : '<li class="empty">The Cave Echo has not retained a memory yet.</li>';
  el.fragmentCount.textContent = String(roomMemories.length);
  el.knotCount.textContent = String(memories.length);
  el.stateValue.textContent = state.ended ? 'Complete' : state.room ? state.room.title : 'Starting';
  renderThreads(nodes, memories);
}

function renderThreads(nodes, memories) {
  el.threadGrid.innerHTML = '';
  const exit = state.room?.exits?.[0];
  if (exit) {
    const committedIds = new Set(memories.map(memory => memory.id));
    const missing = exit.requires_memory_ids.filter(id => !committedIds.has(id));
    const card = document.createElement('article');
    card.className = 'thread-card';
    if (!missing.length) card.classList.add('solved');
    card.innerHTML = `
      <h4>${escapeHtml(exit.label)}</h4>
      <p>${missing.length ? 'The threshold still needs specific Echo-held memories.' : 'The required memories are committed. The route can open.'}</p>
      <div class="thread-meta">${missing.length ? `Missing: ${missing.map(escapeHtml).join(', ')}` : 'Ready to cross'}</div>
      <button class="stone-btn" type="button" ${missing.length ? 'disabled' : ''}>${missing.length ? 'Memory locked' : 'Cross threshold'}</button>
    `;
    card.querySelector('button').addEventListener('click', exitCurrentRoom);
    el.threadGrid.appendChild(card);
  }

  if (state.room?.id === 'root-gate') {
    const finalCard = document.createElement('article');
    finalCard.className = 'thread-card';
    finalCard.innerHTML = `
      <h4>Final Recall</h4>
      <p>When the Echo has enough trusted memory, ask it the question the cave has been avoiding.</p>
      <div class="thread-meta">Ask: Who am I?</div>
      <button class="stone-btn" type="button">Ask the Echo</button>
    `;
    finalCard.querySelector('button').addEventListener('click', () => {
      el.voicePanel.classList.add('open');
      el.voicePanel.setAttribute('aria-hidden', 'false');
      el.chatInput.value = 'Who am I?';
      el.chatInput.focus();
    });
    el.threadGrid.appendChild(finalCard);
  }

  nodes.slice(0, 4).forEach(node => {
    const card = document.createElement('article');
    card.className = 'thread-card solved';
    card.innerHTML = `
      <h4>${escapeHtml(node.label)}</h4>
      <p>The Cave Echo graph is retaining this node through resets.</p>
      <div class="thread-meta">${escapeHtml(node.type)} / ${escapeHtml(node.status)}</div>
    `;
    el.threadGrid.appendChild(card);
  });
}

function updateProgress() {
  const memories = state.graph.memories || [];
  el.progressValue.textContent = String(memories.length);
  el.goalText.textContent = goalText();
}

function goalText() {
  if (!state.room) return 'Enter the cave to begin.';
  const exit = state.room.exits?.[0];
  if (exit) {
    const memoryIds = new Set((state.graph.memories || []).map(memory => memory.id));
    const missing = exit.requires_memory_ids.filter(id => !memoryIds.has(id));
    return missing.length ? `${getSkin().goal} Needed for exit: ${missing.join(', ')}.` : 'The threshold is ready. Open the Clue Box and cross.';
  }
  return getSkin().goal;
}

function updateTimer() {
  const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const seconds = (state.timeLeft % 60).toString().padStart(2, '0');
  el.timer.textContent = `${minutes}:${seconds}`;
  el.timerWrap.classList.toggle('warning', state.timeLeft <= 45 && state.timeLeft > 20);
  el.timerWrap.classList.toggle('danger', state.timeLeft <= 20);
}

function getSkin() {
  return ROOM_SKIN[state.room?.id] || ROOM_SKIN['waking-chamber'];
}

function getHotspotVisual(hotspot, index) {
  const skin = getSkin();
  const fallback = DEFAULT_HOTSPOTS[index % DEFAULT_HOTSPOTS.length];
  return skin.positions[hotspot?.id] || fallback;
}

async function guarded(message, action) {
  try {
    showToast(message);
    await action();
  } catch (error) {
    showToast(error.message || 'The backend request failed.');
    el.narration.textContent = `Backend unavailable or rejected the request: ${error.message || error}`;
    throw error;
  }
}

function addBubble(text, who) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${who}`;
  bubble.textContent = text;
  el.chatLog.appendChild(bubble);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

let toastTimeout;
let bgMusicAudioContext = null;
let bgMusicGainNode = null;

function showToast(message) {
  clearTimeout(toastTimeout);
  el.toast.textContent = message;
  el.toast.classList.add('show');
  toastTimeout = setTimeout(() => el.toast.classList.remove('show'), 2300);
}

function configureBackgroundSoundGain() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor || bgMusicGainNode) return bgMusicAudioContext;

  bgMusicAudioContext = new AudioContextConstructor();
  const source = bgMusicAudioContext.createMediaElementSource(el.bgMusic);
  bgMusicGainNode = bgMusicAudioContext.createGain();
  bgMusicGainNode.gain.value = BG_MUSIC_GAIN;
  source.connect(bgMusicGainNode).connect(bgMusicAudioContext.destination);

  return bgMusicAudioContext;
}

function toggleMusic() {
  state.musicOn = !state.musicOn;
  updateMusicButton();
  if (state.musicOn) {
    startBackgroundSound();
  } else {
    el.bgMusic.pause();
  }
}

function startBackgroundSound() {
  if (!state.musicOn || !el.bgMusic) return;
  el.bgMusic.volume = 1.0;
  const audioContext = configureBackgroundSoundGain();
  updateMusicButton();
  const resumeAudio = audioContext && audioContext.state === 'suspended'
    ? audioContext.resume()
    : Promise.resolve();

  resumeAudio
    .then(() => el.bgMusic.play())
    .catch(() => showToast('Unable to play assets/audio/cave_bg_sound.mp3.'));
}

function updateMusicButton() {
  el.musicBtn.textContent = `Music: ${state.musicOn ? 'On' : 'Off'}`;
}

function playSwoosh() {
  if (!el.swooshSound) return;
  el.swooshSound.currentTime = 0;
  el.swooshSound.play().catch(() => {});
}

function delay(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

async function restartPrototype() {
  state.session = null;
  state.room = null;
  state.graph = { nodes: [], edges: [], memories: [] };
  state.inspection = null;
  state.ended = false;
  el.endingOverlay.hidden = true;
  await startGame();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

el.startBtn.addEventListener('click', startGame);
el.narrationStartBtn.addEventListener('click', beginNarration);
el.skipIntroBtn.addEventListener('click', skipIntro);
el.narrationAudio.addEventListener('ended', finishNarration);
el.narrationAudio.addEventListener('error', finishNarration);
el.plotBtn.addEventListener('click', () => el.introOverlay.classList.remove('hidden'));
el.cluesBtn.addEventListener('click', () => {
  renderClueBox();
  el.clueDialog.showModal();
});
el.closeClues.addEventListener('click', () => el.clueDialog.close());
el.closeInspect.addEventListener('click', () => el.inspectDialog.close());
el.rememberBtn.addEventListener('click', rememberSelected);
el.actBtn.addEventListener('click', exitCurrentRoom);
el.voiceBtn.addEventListener('click', () => {
  el.voicePanel.classList.add('open');
  el.voicePanel.setAttribute('aria-hidden', 'false');
  el.chatInput.focus();
});
el.closeVoice.addEventListener('click', () => {
  el.voicePanel.classList.remove('open');
  el.voicePanel.setAttribute('aria-hidden', 'true');
});
el.chatForm.addEventListener('submit', event => {
  event.preventDefault();
  const text = el.chatInput.value.trim();
  if (!text) return;
  addBubble(text, 'user');
  el.chatInput.value = '';
  askEcho(text);
});
el.musicBtn.addEventListener('click', toggleMusic);
el.restartBtn.addEventListener('click', restartPrototype);

window.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'c') el.cluesBtn.click();
  if (event.key.toLowerCase() === 'v') el.voiceBtn.click();
  if (event.key.toLowerCase() === 'p') el.plotBtn.click();
});

state.tickHandle = setInterval(() => {
  if (!state.running || state.ended) return;
  state.timeLeft -= 1;
  if (state.timeLeft <= 0) {
    resetMemoryCycle();
  } else {
    updateTimer();
  }
}, 1000);

renderRoom();
renderScene();
renderClueBox();
updateProgress();
updateTimer();
updateMusicButton();
