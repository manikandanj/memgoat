
const GAME = {
  room: {
    id: 'shard-hollow',
    title: 'Shard Hollow',
    subtitle: 'The witch kept her ritual scraps here. A blue seam of daylight wounds the stone.',
    goal: 'Inspect the room and recover enough clue fragments to weave your first Memory Knot.',
    narration: 'The chamber knows me better than I know myself. I have two minutes before the cave rinses my head clean again.',
    hotspots: [
      {
        id: 'ritual-bowl',
        label: 'Cracked ritual bowl',
        type: 'clue',
        image: 'assets/clue_ritual_bowl.png',
        x: 28, y: 47, w: 12, h: 14, radius: '14px',
        blurb: 'A broken vessel set near the ritual ring, as if it once collected something more important than water.',
        observation: 'Three black stones are wedged into the crack as if someone repaired the bowl just enough to keep using it. Dark residue clings to the inside.',
        clue: 'This bowl was part of the cave’s ritual apparatus. It was built to hold memories or offerings, not food.',
        tags: ['ritual', 'vessel', 'residue'],
        narration: 'The bowl is too carefully mended to be trash. Someone needed it functional, even in pieces.'
      },
      {
        id: 'eye-shard',
        label: 'Reflective bowl shard',
        type: 'clue',
        image: 'assets/clue_eye_shard.png',
        x: 44, y: 67, w: 7.5, h: 9, radius: '18px',
        blurb: 'A pale fragment on the floor flashes with a reflection that should not exist.',
        observation: 'When I angle the shard, a human eye stares back from its surface. Not mine. Or not only mine.',
        clue: 'One broken shard retains a trapped witness-memory. The ritual didn’t just break objects — it stored identity.',
        tags: ['memory', 'witness', 'shard'],
        narration: 'The shard looks back. That is worse than a normal piece of pottery.'
      },
      {
        id: 'scratch-marks',
        label: 'Counting scratches',
        type: 'clue',
        image: 'assets/clue_scratch_marks.png',
        x: 36.4, y: 25.5, w: 10.5, h: 17, radius: '10px',
        blurb: 'Deep gouges cut the back wall in a deliberate set.',
        observation: 'There are four marks, but only the third is deeper and cleaner — more sign than damage.',
        clue: 'The scratches are a coded count. The third mark is the one meant to be followed.',
        tags: ['count', 'marking', 'wall'],
        narration: 'Not random panic-scratches. Too neat. Too pointed. Someone counted on this wall surviving longer than memory.'
      },
      {
        id: 'ward-cloth',
        label: 'Torn ward strip',
        type: 'clue',
        image: 'assets/clue_ward_cloth.png',
        x: 43, y: 32, w: 5, h: 16, radius: '12px',
        blurb: 'A dark strip of cloth hangs from the stone like a dead tongue.',
        observation: 'The cloth is tied directly beside the scratched section of wall. It feels less decorative than directional.',
        clue: 'The hanging strip was left as a marker, drawing attention to the same section of wall as the scratch-count.',
        tags: ['marker', 'cloth', 'wall'],
        narration: 'The cloth points without pointing. The room keeps repeating the same instruction.'
      },
      {
        id: 'loose-bricks',
        label: 'Loose bricks',
        type: 'clue',
        image: 'assets/bricks.png',
        x: 10.2, y: 22.8, w: 11.8, h: 22, radius: '12px',
        blurb: 'The left wall doesn’t quite trust its own structure.',
        observation: 'Several bricks have been disturbed, but one cluster feels more deliberate than collapsed. A cool breath leaks through it.',
        clue: 'A hidden opening sits behind the weakened masonry. The right brick to pry will probably be the third one.',
        tags: ['brick', 'hidden', 'draft'],
        narration: 'The wall breathes. That is either a good sign or a terrible architectural opinion.'
      },
      {
        id: 'ash-ring',
        label: 'Ash circle',
        type: 'clue',
        image: 'assets/clue_ash_ring.png',
        x: 25, y: 47, w: 20, h: 18, radius: '50%',
        blurb: 'The center ring is blackened, but not from simple candle smoke.',
        observation: 'Ash, powdered bone, and wax were pressed into the stone circle. The residue radiates inward, as if something was drained toward the middle.',
        clue: 'The ritual ring was used to pull memory inward and trap it in a vessel. This chamber was an extraction site.',
        tags: ['ritual', 'ash', 'drain'],
        narration: 'This wasn’t worship. It was processing.'
      },
      {
        id: 'blue-fissure',
        label: 'Blue fissure',
        type: 'clue',
        image: 'assets/clue_blue_fissure.png',
        x: 6.8, y: 19.5, w: 8.6, h: 26, radius: '10px',
        blurb: 'Cold light leaks in through the broken masonry.',
        observation: 'Mist curls from the crack with the smell of wet stone and outside air. The opening is narrow, but real.',
        clue: 'The blue draft comes from a genuine exit route or near-surface passage beyond the wall.',
        tags: ['exit', 'draft', 'blue light'],
        narration: 'Real air. Real cold. The best thing I have found in this cave is a draft.'
      },
      {
        id: 'kael-niche',
        label: 'Hidden name niche',
        type: 'clue',
        image: 'assets/clue_kael_niche.png',
        x: 14, y: 25, w: 13, h: 20, radius: '12px',
        hidden: true,
        blurb: 'Behind the pried stones, a recess holds a name the cave did not manage to erase.',
        observation: 'The niche is carved with one clean word: KAEL. Not a warning. A name. Perhaps mine.',
        clue: 'The hidden wall cavity preserves the name KAEL. Recovering the name stabilizes identity and weakens the cave’s reset.',
        tags: ['name', 'identity', 'hidden'],
        narration: 'KAEL. The word lands in my skull like a stone finding its proper slot.'
      },
      {
        id: 'exit-passage',
        label: 'Widened passage',
        type: 'action',
        image: 'assets/clue_blue_fissure.png',
        x: 6.8, y: 19.5, w: 10, h: 28, radius: '10px',
        hidden: true,
        finalTarget: true,
        blurb: 'The weakened wall can now be forced open.',
        observation: 'With the name restored and the route understood, the draft no longer feels like a rumor. The crack is ready to become a passage.',
        clue: 'Push through the fissure and leave the chamber.',
        tags: ['exit', 'escape'],
        actionLabel: 'Open passage',
        actionKey: 'escape',
        narration: 'I know what this chamber did, who it tried to erase, and where the air is coming from. That is enough. It has to be enough.'
      }
    ],
    threads: [
      {
        id: 'counted-warning',
        title: 'Counted Warning',
        description: 'The back-wall scratches and ward strip both indicate a deliberate count. They point to the third disturbed brick.',
        needs: ['scratch-marks', 'ward-cloth', 'loose-bricks'],
        result: 'I now know exactly which brick cluster should be pried apart.',
        unlocksHotspot: 'kael-niche',
        stateLabel: 'Unlocks hidden niche'
      },
      {
        id: 'ritual-function',
        title: 'Memory Vessel',
        description: 'The bowl, ash ring, and reflective shard reveal the ritual’s purpose: memories were drained and stored, not merely destroyed.',
        needs: ['ritual-bowl', 'ash-ring', 'eye-shard'],
        result: 'The chamber was used to extract memory and trap identity in a vessel.',
        stateLabel: 'Persists through resets'
      },
      {
        id: 'buried-identity',
        title: 'Buried Identity',
        description: 'Once the niche is found, the preserved name connects to the ritual evidence. The cave erased a person, but failed to erase the anchor completely.',
        needs: ['kael-niche', 'ritual-bowl', 'eye-shard'],
        result: 'KAEL is the identity tied to this chamber. Speaking or accepting the name stabilizes memory.',
        stateLabel: 'Stabilizes identity'
      },
      {
        id: 'way-out',
        title: 'Way Out',
        description: 'The blue fissure is not just air. Combined with the restored identity and the hidden masonry, it becomes a real route out.',
        needs: ['blue-fissure', 'loose-bricks', 'kael-niche'],
        result: 'The blue seam beyond the broken wall is the escape route. The passage can be forced open.',
        unlocksHotspot: 'exit-passage',
        stateLabel: 'Unlocks final action'
      }
    ]
  },
  duration: 120
};

const el = {
  sceneItems: document.getElementById('sceneItems'),
  roomTitle: document.getElementById('roomTitle'),
  roomSubtitle: document.getElementById('roomSubtitle'),
  goalText: document.getElementById('goalText'),
  narration: document.getElementById('narration'),
  timer: document.getElementById('timer'),
  timerWrap: document.getElementById('timerWrap'),
  progressValue: document.getElementById('progressValue'),
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
  sfxBtn: document.getElementById('sfxBtn'),
  endingOverlay: document.getElementById('endingOverlay'),
  endingText: document.getElementById('endingText'),
  restartBtn: document.getElementById('restartBtn'),
  bgMusic: document.getElementById('bgMusic')
};

const state = {
  discovered: new Set(),
  solvedThreads: new Set(),
  unlockedHotspots: new Set(),
  selectedHotspot: null,
  timeLeft: GAME.duration,
  running: false,
  ended: false,
  musicOn: false,
  sfxOn: true,
  archive: [],
  tickHandle: null
};

function startGame() {
  el.introOverlay.classList.add('hidden');
  resetRun({ full: true });
  state.running = true;
  showToast('Hover the room. Click anything suspicious.');
}

function resetRun({ full = false } = {}) {
  state.discovered.clear();
  state.solvedThreads.clear();
  state.unlockedHotspots.clear();
  state.selectedHotspot = null;
  state.timeLeft = GAME.duration;
  state.ended = false;
  if (full) state.archive = [];
  el.endingOverlay.hidden = true;
  el.roomTitle.textContent = GAME.room.title;
  el.roomSubtitle.textContent = GAME.room.subtitle;
  el.goalText.textContent = GAME.room.goal;
  el.narration.textContent = GAME.room.narration;
  renderScene();
  renderClueBox();
  updateProgress();
  updateTimer();
}

function renderScene() {
  el.sceneItems.innerHTML = '';
  GAME.room.hotspots.forEach(h => {
    const hidden = h.hidden && !state.unlockedHotspots.has(h.id);
    if (hidden) return;
    const btn = document.createElement('button');
    btn.className = 'hotspot';
    if (state.discovered.has(h.id)) btn.classList.add('found');
    if (h.finalTarget) btn.classList.add('final-target');
    if (isActionReady(h)) btn.classList.add('actionable');
    btn.style.left = h.x + '%';
    btn.style.top = h.y + '%';
    btn.style.width = h.w + '%';
    btn.style.height = h.h + '%';
    btn.style.borderRadius = h.radius || '12px';
    btn.innerHTML = `
      <span class="hotspot-asset-wrap">
        <img class="hotspot-asset" src="${h.image}" alt="" aria-hidden="true" />
      </span>
      <span class="hotspot-label">${h.label}</span>
      <span class="hotspot-status">${state.discovered.has(h.id) ? '✓' : '•'}</span>
    `;
    btn.addEventListener('click', () => openInspect(h.id));
    el.sceneItems.appendChild(btn);
  });
}

function openInspect(id) {
  const hotspot = getHotspot(id);
  state.selectedHotspot = hotspot.id;
  el.inspectImage.src = hotspot.image;
  el.inspectTitle.textContent = hotspot.label;
  el.inspectType.textContent = hotspot.type === 'action' ? 'Action' : 'Clue';
  el.inspectBlurb.textContent = hotspot.blurb;
  el.inspectObservation.textContent = hotspot.observation;
  el.inspectClue.textContent = hotspot.clue;
  el.inspectTags.innerHTML = hotspot.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

  const already = state.discovered.has(hotspot.id);
  if (hotspot.type === 'clue') {
    el.rememberBtn.hidden = false;
    el.rememberBtn.textContent = already ? 'Already remembered' : 'Commit to memory';
    el.rememberBtn.disabled = already;
  } else {
    el.rememberBtn.hidden = true;
  }

  const actionReady = isActionReady(hotspot);
  if (actionReady) {
    el.actBtn.hidden = false;
    el.actBtn.textContent = hotspot.actionLabel || 'Perform action';
  } else {
    el.actBtn.hidden = true;
  }

  el.inspectDialog.showModal();
}

function rememberSelected() {
  const hotspot = getHotspot(state.selectedHotspot);
  if (!hotspot || state.discovered.has(hotspot.id)) return;
  state.discovered.add(hotspot.id);
  state.archive.push({
    kind: 'clue',
    title: hotspot.label,
    detail: hotspot.clue,
    time: new Date().toLocaleTimeString()
  });
  el.narration.textContent = hotspot.narration;
  showToast('Clue committed to short memory.');
  renderScene();
  renderClueBox();
  updateProgress();
  if (state.selectedHotspot === hotspot.id) {
    el.rememberBtn.textContent = 'Already remembered';
    el.rememberBtn.disabled = true;
  }
}

function isActionReady(hotspot) {
  if (!hotspot) return false;
  if (hotspot.actionKey === 'escape') {
    return state.solvedThreads.has('way-out') && state.solvedThreads.has('buried-identity');
  }
  return false;
}

function runAction() {
  const hotspot = getHotspot(state.selectedHotspot);
  if (!hotspot) return;

  if (hotspot.id === 'exit-passage' && isActionReady(hotspot)) {
    state.ended = true;
    state.running = false;
    el.inspectDialog.close();
    el.narration.textContent = 'KAEL. I say the name, shoulder the weakened stone, and the cold slit of daylight becomes a passage wide enough for panic and hope.';
    el.endingText.textContent = 'You recovered the chamber’s hidden logic, restored the name KAEL, and turned the blue seam of air into a real escape route. This prototype is now set up for more rooms, new assets, music, and sound effects.';
    el.endingOverlay.hidden = false;
    showToast('Prototype escape reached.');
  }
}

function getHotspot(id) {
  return GAME.room.hotspots.find(h => h.id === id);
}

function getDiscoveredHotspots() {
  return [...state.discovered].map(getHotspot).filter(Boolean);
}

function updateProgress() {
  el.progressValue.textContent = `${state.solvedThreads.size} / ${GAME.room.threads.length}`;
  if (state.solvedThreads.has('way-out') && state.solvedThreads.has('buried-identity')) {
    el.goalText.textContent = 'The passage is ready. Inspect the blue fissure again and open the route out.';
  } else if (state.unlockedHotspots.has('kael-niche') && !state.discovered.has('kael-niche')) {
    el.goalText.textContent = 'The hidden niche is exposed. Inspect the wall cavity and recover the preserved name.';
  } else if (state.solvedThreads.size > 0) {
    el.goalText.textContent = 'Weave more deductions. Short-term clues vanish, but solved Memory Knots survive the reset.';
  } else {
    el.goalText.textContent = GAME.room.goal;
  }
}

function updateTimer() {
  const minutes = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const seconds = (state.timeLeft % 60).toString().padStart(2, '0');
  el.timer.textContent = `${minutes}:${seconds}`;
  el.timerWrap.classList.toggle('warning', state.timeLeft <= 45 && state.timeLeft > 20);
  el.timerWrap.classList.toggle('danger', state.timeLeft <= 20);
}

function resetMemoryCycle() {
  if (state.discovered.size) {
    state.archive.push({
      kind: 'reset',
      title: 'Memory tide',
      detail: 'The timer wiped your current clue fragments. Only solved Memory Knots remained etched.',
      time: new Date().toLocaleTimeString()
    });
  }
  state.discovered.clear();
  state.timeLeft = GAME.duration;
  renderScene();
  renderClueBox();
  updateProgress();
  updateTimer();
  el.narration.textContent = 'The cave exhales. Loose fragments wash away. The knots I solved remain, but everything else has to be learned again.';
  showToast('Memory tide reset. Knots remain, fragments vanish.');
}

function renderClueBox() {
  const current = getDiscoveredHotspots().filter(h => h.type === 'clue');
  el.clueList.innerHTML = current.length
    ? current.map(h => `<li><strong>${h.label}:</strong> ${h.clue}</li>`).join('')
    : '<li class="empty">No current fragments committed.</li>';

  const solved = GAME.room.threads.filter(t => state.solvedThreads.has(t.id));
  el.connectionList.innerHTML = solved.length
    ? solved.map(t => `<li><strong>${t.title}:</strong> ${t.result}</li>`).join('')
    : '<li class="empty">No Memory Knots etched yet.</li>';

  el.fragmentCount.textContent = String(current.length);
  el.knotCount.textContent = String(solved.length);
  el.stateValue.textContent = state.ended ? 'Escaped' : state.solvedThreads.size ? 'Deducing' : 'Searching';

  el.threadGrid.innerHTML = '';
  GAME.room.threads.forEach(thread => {
    const card = document.createElement('article');
    card.className = 'thread-card';
    if (state.solvedThreads.has(thread.id)) card.classList.add('solved');
    const ready = thread.needs.every(id => state.discovered.has(id) || state.solvedThreads.has(id));
    const missing = thread.needs
      .filter(id => !(state.discovered.has(id) || state.solvedThreads.has(id)))
      .map(id => getHotspot(id)?.label || id);
    const tagList = thread.needs
      .map(id => getHotspot(id)?.label || id)
      .map(name => `<span class="tag">${name}</span>`).join('');

    card.innerHTML = `
      <h4>${thread.title}</h4>
      <p>${thread.description}</p>
      <div class="thread-tags">${tagList}</div>
      <div class="thread-meta">${state.solvedThreads.has(thread.id)
        ? `Solved — ${thread.result}`
        : ready
          ? `Ready to weave — ${thread.stateLabel || 'Creates a Memory Knot'}`
          : `Missing: ${missing.join(', ')}`}</div>
      <button class="stone-btn" ${(!ready || state.solvedThreads.has(thread.id)) ? 'disabled' : ''}>${state.solvedThreads.has(thread.id) ? 'Memory Knot etched' : 'Weave memory'}</button>
    `;
    const btn = card.querySelector('button');
    if (ready && !state.solvedThreads.has(thread.id)) {
      btn.addEventListener('click', () => solveThread(thread.id));
    }
    el.threadGrid.appendChild(card);
  });
}

function solveThread(threadId) {
  const thread = GAME.room.threads.find(t => t.id === threadId);
  if (!thread || state.solvedThreads.has(thread.id)) return;
  const ready = thread.needs.every(id => state.discovered.has(id) || state.solvedThreads.has(id));
  if (!ready) return;

  state.solvedThreads.add(thread.id);
  state.archive.push({
    kind: 'thread',
    title: thread.title,
    detail: thread.result,
    time: new Date().toLocaleTimeString()
  });

  if (thread.unlocksHotspot) {
    state.unlockedHotspots.add(thread.unlocksHotspot);
    if (thread.unlocksHotspot === 'kael-niche') {
      el.narration.textContent = 'The pattern finally holds. Third mark. Third brick. There is a hidden cavity behind the wall.';
      showToast('Memory Knot etched. Hidden niche revealed.');
    } else if (thread.unlocksHotspot === 'exit-passage') {
      el.narration.textContent = 'The blue seam is no rumor now. The wall can be forced into a passage.';
      showToast('Escape route identified.');
    }
  } else {
    el.narration.textContent = thread.result;
    showToast('Memory Knot etched. This deduction will survive resets.');
  }

  renderScene();
  renderClueBox();
  updateProgress();
}

function caveAnswer(question) {
  const q = question.toLowerCase();
  const have = id => state.discovered.has(id) || state.solvedThreads.has(id);

  if (q.includes('what now') || q.includes('goal') || q.includes('help')) {
    if (state.solvedThreads.has('way-out') && state.solvedThreads.has('buried-identity')) {
      return 'You already know enough. Inspect the blue fissure again and force the route open.';
    }
    if (state.unlockedHotspots.has('kael-niche') && !state.discovered.has('kael-niche')) {
      return 'The wall cavity is open. The answer waiting in it is a name.';
    }
    return 'Find fragments, then weave them. Scratches, cloth, bricks. Bowl, ash, shard. Draft, name, exit.';
  }

  if (q.includes('brick') || q.includes('wall')) {
    return have('scratch-marks') && have('ward-cloth')
      ? 'The room has repeated itself enough. Not the first disturbed brick. Not the last. The third.'
      : 'The wall needs context. Look for anything in the room that counts, points, or repeats.';
  }

  if (q.includes('bowl') || q.includes('ritual') || q.includes('shard')) {
    return have('ritual-bowl') && have('ash-ring')
      ? 'The chamber did not destroy memory; it processed it. The bowl and the circle were machinery disguised as ritual.'
      : 'The bowl is only one sentence. Find the ash at the center and the shard that still reflects.';
  }

  if (q.includes('name') || q.includes('kael') || q.includes('who am i')) {
    return state.discovered.has('kael-niche') || state.solvedThreads.has('buried-identity')
      ? 'KAEL. Keep the name. Say it in your head until the cave starts to hate how steady you sound.'
      : 'A name is hidden where the wall was taught to count.';
  }

  if (q.includes('exit') || q.includes('escape') || q.includes('outside') || q.includes('blue')) {
    return have('blue-fissure')
      ? 'Cold light does not lie. But a route is only useful when you understand why it was hidden and whose memory it guarded.'
      : 'Smell the air. The room already leaks the answer.';
  }

  return 'Ask me about the wall, the bowl, the name, or the way out. I do have standards for vague despair.';
}

function addBubble(text, who) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${who}`;
  bubble.textContent = text;
  el.chatLog.appendChild(bubble);
  el.chatLog.scrollTop = el.chatLog.scrollHeight;
}

let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  el.toast.textContent = message;
  el.toast.classList.add('show');
  toastTimeout = setTimeout(() => el.toast.classList.remove('show'), 2300);
}

function toggleMusic() {
  state.musicOn = !state.musicOn;
  el.musicBtn.textContent = `Music: ${state.musicOn ? 'On' : 'Off'}`;
  if (state.musicOn) {
    el.bgMusic.play().catch(() => showToast('Add assets/audio/ambient-cave.mp3 to enable music.'));
  } else {
    el.bgMusic.pause();
  }
}

function restartPrototype() {
  state.running = true;
  resetRun({ full: true });
}

el.startBtn.addEventListener('click', startGame);
el.plotBtn.addEventListener('click', () => el.introOverlay.classList.remove('hidden'));
el.cluesBtn.addEventListener('click', () => {
  renderClueBox();
  el.clueDialog.showModal();
});
el.closeClues.addEventListener('click', () => el.clueDialog.close());
el.closeInspect.addEventListener('click', () => el.inspectDialog.close());
el.rememberBtn.addEventListener('click', rememberSelected);
el.actBtn.addEventListener('click', runAction);
el.voiceBtn.addEventListener('click', () => {
  el.voicePanel.classList.add('open');
  el.voicePanel.setAttribute('aria-hidden', 'false');
  el.chatInput.focus();
});
el.closeVoice.addEventListener('click', () => {
  el.voicePanel.classList.remove('open');
  el.voicePanel.setAttribute('aria-hidden', 'true');
});
el.chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = el.chatInput.value.trim();
  if (!text) return;
  addBubble(text, 'user');
  el.chatInput.value = '';
  setTimeout(() => addBubble(caveAnswer(text), 'cave'), 380);
});
el.musicBtn.addEventListener('click', toggleMusic);
el.sfxBtn.addEventListener('click', () => {
  state.sfxOn = !state.sfxOn;
  el.sfxBtn.textContent = `SFX: ${state.sfxOn ? 'On' : 'Off'}`;
});
el.restartBtn.addEventListener('click', restartPrototype);

window.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'c') el.cluesBtn.click();
  if (e.key.toLowerCase() === 'v') el.voiceBtn.click();
  if (e.key.toLowerCase() === 'p') el.plotBtn.click();
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

renderScene();
renderClueBox();
updateProgress();
updateTimer();
