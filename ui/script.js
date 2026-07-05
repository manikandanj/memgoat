const IMG = {
  bowl: 'assets/broken_bowl.png',
  scratches: 'assets/scratch_marks.png',
  bricks: 'assets/bricks.png'
};

const rooms = [
  {
    id: 'shard-hollow',
    title: 'Shard Hollow',
    subtitle: 'The witch kept her ritual scraps here. The cave smells of salt, dust, and old spells.',
    entry: 'The bowl, the wall, the rubble. I know these matter. I just need my head to keep up with my hooves.',
    exit: 'The third loose brick gives way. A slit in the rock opens, and I squeeze through before the cave changes its mind.',
    items: [
      {
        id: 'ritual-bowl', label: 'Cracked ritual bowl', image: IMG.bowl, x: 18, y: 44, w: 150, h: 120, shape: '18px',
        clue: 'A shattered ritual bowl holds three dark pebbles trapped along one crack.',
        connection: 'Three pebbles suggest the third marked thing is important.',
        narration: 'This bowl was part of whatever made me goat-shaped. Three dark pebbles still sit in one fracture like a warning.'
      },
      {
        id: 'wall-scratches', label: 'Wall scratches', image: IMG.scratches, x: 44, y: 38, w: 160, h: 110, shape: '12px',
        clue: 'The wall shows three long scratches and a short cut beside them.',
        connection: 'Count to three, then stop. The marks point to a specific brick, not all of them.',
        narration: 'Three long scratches, one short. Not decoration. A count. A stop. A little note left for someone desperate.'
      },
      {
        id: 'loose-bricks', label: 'Loose bricks', image: IMG.bricks, x: 71, y: 48, w: 155, h: 125, shape: '16px',
        clue: 'The third brick in the pile wobbles and leaks a thread of cold air.',
        connection: 'Pull the third loose brick to reveal the way forward.',
        narration: 'Cold air sneaks around the third brick. Good. Air means a gap. A gap means a chance.'
      }
    ]
  },
  {
    id: 'rubble-passage',
    title: 'Rubble Passage',
    subtitle: 'The floor tilts. Wind whistles through cracks, but not all cracks lead out.',
    entry: 'The last room sealed behind me. My clue box is empty again. If I forget, I will have to ask the cave to lie helpfully.',
    exit: 'A spiral-marked stone sinks under my hoof, and the right-hand passage yawns open with a dry groan.',
    items: [
      {
        id: 'marked-rubble', label: 'Collapsed arch stones', image: IMG.bricks, x: 22, y: 44, w: 165, h: 122, shape: '16px',
        clue: 'One brick in the fallen arch bears a faded spiral and feels warmer than the others.',
        connection: 'The spiral-marked brick acts like a hidden latch.',
        narration: 'One stone is warm. That is rude and unnatural, which means it is useful.'
      },
      {
        id: 'direction-scratches', label: 'Direction scratches', image: IMG.scratches, x: 48, y: 34, w: 170, h: 112, shape: '12px',
        clue: 'Fresh scratches all lean to the right, never the left.',
        connection: 'At the split, the safe path is the right-hand tunnel.',
        narration: 'Everything about these scratches says go right. I appreciate a clue with commitment.'
      },
      {
        id: 'light-shard', label: 'Bowl shard', image: IMG.bowl, x: 74, y: 49, w: 142, h: 114, shape: '16px',
        clue: 'A white bowl shard catches a ribbon of blue daylight when lifted.',
        connection: 'The passage carrying blue daylight leads closer to the surface.',
        narration: 'A shard flashes blue when I tilt it. Light from somewhere ahead. Real light. Not witch light.'
      }
    ]
  },
  {
    id: 'wind-mouth',
    title: 'Wind Mouth',
    subtitle: 'A final chamber where the cave forgets to keep all of its breath inside.',
    entry: 'I can smell outside now. Dirt, leaves, rain. The memory reset can bite me if it wants; I am almost free.',
    exit: 'I climb the rubble, push through the wind hole, and find the outside waiting. Prototype escape complete.',
    items: [
      {
        id: 'exit-scratches', label: 'Climb scratches', image: IMG.scratches, x: 24, y: 36, w: 158, h: 106, shape: '12px',
        clue: 'Five pale scratches converge on a ledge high in the wall.',
        connection: 'The scratches mark the climbable route upward.',
        narration: 'The wall is scratched where something climbed. Good. I am something with hooves and panic.'
      },
      {
        id: 'step-rubble', label: 'Rubble steps', image: IMG.bricks, x: 48, y: 50, w: 170, h: 126, shape: '16px',
        clue: 'A pile of fallen bricks forms a rough staircase beneath the opening.',
        connection: 'Use the rubble as footholds to reach the ledge.',
        narration: 'This collapse is almost considerate. A staircase made by bad architecture.'
      },
      {
        id: 'wind-bowl', label: 'Hollow bowl shell', image: IMG.bowl, x: 72, y: 40, w: 145, h: 118, shape: '16px',
        clue: 'The broken bowl shell hums softly only near the stream of incoming wind.',
        connection: 'The wind hole beside the humming bowl shell is the way outside.',
        narration: 'The bowl hums near the draft. Even shattered things know where freedom leaks in.'
      }
    ]
  }
];

let currentRoom = 0;
let found = {};
let archivedMemory = [];
let timeLeft = 120;
let toastTimeout;

const sceneItems = document.getElementById('sceneItems');
const roomTitle = document.getElementById('roomTitle');
const roomSubtitle = document.getElementById('roomSubtitle');
const narration = document.getElementById('narration');
const timer = document.getElementById('timer');
const clueDialog = document.getElementById('clueDialog');
const clueList = document.getElementById('clueList');
const connectionList = document.getElementById('connectionList');
const voicePanel = document.getElementById('voicePanel');
const chatLog = document.getElementById('chatLog');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const toast = document.getElementById('toast');

function getFoundItems() {
  return Object.values(found).flat();
}

function renderRoom() {
  const room = rooms[currentRoom];
  roomTitle.textContent = room.title;
  roomSubtitle.textContent = room.subtitle;
  narration.textContent = room.entry;
  sceneItems.innerHTML = '';

  room.items.forEach(item => {
    const el = document.createElement('button');
    el.className = 'item';
    if ((found[room.id] || []).some(clue => clue.id === item.id)) el.classList.add('found');
    el.style.left = item.x + '%';
    el.style.top = item.y + '%';
    el.style.width = item.w + 'px';
    el.style.height = item.h + 'px';
    el.style.borderRadius = item.shape;
    el.innerHTML = `<img src="${item.image}" alt="${item.label}"><span class="item-label">${item.label}</span>`;
    el.addEventListener('click', () => collectClue(item));
    sceneItems.appendChild(el);
  });
}

function collectClue(item) {
  const room = rooms[currentRoom];
  found[room.id] ||= [];
  if (!found[room.id].some(clue => clue.id === item.id)) {
    found[room.id].push(item);
    archivedMemory.push({ room: room.title, clue: item.clue, connection: item.connection, time: new Date().toLocaleTimeString() });
    showToast('Clue etched into short memory.');
  } else {
    showToast('Already found. The cave lets you keep it for now.');
  }
  narration.textContent = item.narration;
  renderRoom();
}

function renderClues() {
  const items = getFoundItems();
  clueList.innerHTML = '';
  connectionList.innerHTML = '';
  if (!items.length) {
    clueList.innerHTML = '<li class="empty">No clues currently remembered.</li>';
    connectionList.innerHTML = '<li class="empty">No connections currently held.</li>';
    return;
  }
  items.forEach(item => {
    const clueLi = document.createElement('li');
    clueLi.textContent = item.clue;
    clueList.appendChild(clueLi);
    const conLi = document.createElement('li');
    conLi.textContent = item.connection;
    connectionList.appendChild(conLi);
  });
}

function moveRoom(direction) {
  const room = rooms[currentRoom];
  const items = found[room.id] || [];
  const enough = items.length >= 3;

  if (direction > 0 && enough && currentRoom < rooms.length - 1) {
    narration.textContent = room.exit;
    currentRoom += 1;
    found = {};
    timeLeft = 120;
    updateTimer();
    setTimeout(renderRoom, 700);
    showToast('The room seals behind you. Current clues are gone.');
    return;
  }

  if (direction < 0) {
    narration.textContent = 'The passage behind me has become stone. The witch hates revision.';
    showToast('No backtracking. Ask the cave voice if you need old echoes.');
    return;
  }

  if (currentRoom === rooms.length - 1 && enough) {
    narration.textContent = 'The outside scent wins. This prototype ends with the goat escaping into open air.';
    showToast('Demo escape reached.');
    return;
  }

  narration.textContent = 'I try to press onward, but the cave wants a full pattern, not a lucky guess.';
  showToast('Find all three room clues first.');
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  timer.textContent = `${minutes}:${seconds}`;
}

function resetMemory() {
  const items = getFoundItems();
  if (items.length) {
    archivedMemory.push({ room: rooms[currentRoom].title, clue: 'The timer reset wiped the visible clue box.', connection: 'Only the Cave Voice can hint at what used to be known.', time: new Date().toLocaleTimeString() });
  }
  found = {};
  timeLeft = 120;
  updateTimer();
  renderRoom();
  narration.textContent = 'The cave exhales. My clues vanish. Something in the dark still remembers, but it will not speak straight.';
  showToast('Memory reset. Clue Box wiped.');
}

setInterval(() => {
  timeLeft -= 1;
  if (timeLeft <= 0) resetMemory();
  updateTimer();
}, 1000);

function caveAnswer(question) {
  const q = question.toLowerCase();
  const old = archivedMemory.slice(-10);
  const roomHints = old.filter(entry => entry.room === rooms[currentRoom].title);
  const source = roomHints.length ? roomHints : old;

  if (!source.length) {
    return 'I have no swallowed clues yet, little horned prisoner. Touch the room first, then ask what it took from you.';
  }

  const joined = source.map(e => `${e.clue} ${e.connection}`).join(' ').toLowerCase();

  if (q.includes('brick') || q.includes('stone') || joined.includes('brick')) {
    return 'Stone speaks in numbers here. Not the first, not the last. The useful one often sits exactly where repetition tells you to stop.';
  }
  if (q.includes('scratch') || q.includes('mark') || joined.includes('scratch')) {
    return 'The wall is trying very hard to count for you. Follow the repeated cuts, and notice which way they lean.';
  }
  if (q.includes('bowl') || q.includes('shard') || joined.includes('bowl')) {
    return 'Even broken vessels can point. Watch what the white pieces cradle, catch, or hum toward.';
  }
  if (q.includes('exit') || q.includes('escape') || q.includes('door') || q.includes('outside')) {
    return 'To leave, trust three kinds of truth: a counted sign, a chosen stone, and the place where cold air or blue light refuses to hide.';
  }
  if (q.includes('left') || q.includes('right')) {
    return 'Some warnings do not use words. When every wound on the wall leans the same way, perhaps your hooves should too.';
  }

  return 'Your lost knowledge has edges: counted scratches, meaningful stones, and broken white pottery that still knows where freedom is. Ask narrower, and I will be less poetic.';
}

function addBubble(text, who) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${who}`;
  bubble.textContent = text;
  chatLog.appendChild(bubble);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function showToast(message) {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 2100);
}

document.getElementById('cluesBtn').addEventListener('click', () => {
  renderClues();
  clueDialog.showModal();
});
document.getElementById('closeClues').addEventListener('click', () => clueDialog.close());
document.getElementById('voiceBtn').addEventListener('click', () => {
  voicePanel.classList.add('open');
  voicePanel.setAttribute('aria-hidden', 'false');
  chatInput.focus();
});
document.getElementById('closeVoice').addEventListener('click', () => {
  voicePanel.classList.remove('open');
  voicePanel.setAttribute('aria-hidden', 'true');
});
document.getElementById('leftBtn').addEventListener('click', () => moveRoom(-1));
document.getElementById('rightBtn').addEventListener('click', () => moveRoom(1));

chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addBubble(text, 'user');
  chatInput.value = '';
  setTimeout(() => addBubble(caveAnswer(text), 'cave'), 450);
});

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveRoom(-1);
  if (e.key === 'ArrowRight') moveRoom(1);
  if (e.key.toLowerCase() === 'c') document.getElementById('cluesBtn').click();
  if (e.key.toLowerCase() === 'v') document.getElementById('voiceBtn').click();
});

renderRoom();
updateTimer();
