const photos = document.querySelectorAll('.photo-frame .photo');
let photoIndex = 0;
if (photos.length > 1) {
  setInterval(() => {
    photos[photoIndex].classList.remove('active');
    photoIndex = (photoIndex + 1) % photos.length;
    photos[photoIndex].classList.add('active');
  }, 2800);
}
const noBtn = document.getElementById('noBtn');
const noMsg = document.getElementById('noMsg');
const yesBtn = document.getElementById('yesBtn');
let dodgeCount = 0;

const messages = [
  "Nice try 😏",
  "Nope, can't click that one!",
  "Come on, you know the answer 💕",
  "Keep trying, I dare you 😌",
  "It's not going to work...",
  "Only Yes works here 🥲",
  "Persistent, huh? Still no luck.",
  "The universe says: click Yes 🌟"
];

function dodge(el) {
  dodgeCount++;
  el.classList.add('escaping');

  const btnRect = el.getBoundingClientRect();
  const w = btnRect.width;
  const h = btnRect.height;
  const margin = 20;

  const maxX = window.innerWidth - w - margin;
  const maxY = window.innerHeight - h - margin;

  const newX = Math.max(margin, Math.random() * maxX);
  const newY = Math.max(margin, Math.random() * maxY);

  el.style.left = newX + 'px';
  el.style.top = newY + 'px';

  // grow the Yes button a little each time, just for fun
  const scale = Math.min(1 + dodgeCount * 0.06, 1.8);
  yesBtn.style.transform = `scale(${scale})`;

  noMsg.textContent = messages[Math.min(dodgeCount - 1, messages.length - 1)];
}

function sayYes() {
  document.getElementById('questionScreen').classList.add('hidden');
  document.getElementById('planScreen').classList.remove('hidden');

  // default the date picker to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('eventDate').value = `${yyyy}-${mm}-${dd}`;

  launchConfetti();
}

function launchConfetti() {
  const emojis = ['💖','💕','🎉','✨','💐'];
  for (let i = 0; i < 30; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (Math.random() * 2 + 2) + 's';
    el.style.fontSize = (Math.random() * 1 + 1) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
}

function pad(n) { return String(n).padStart(2, '0'); }

function formatICSDate(date) {
  return date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) + 'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) + 'Z';
}

function confirmDate() {
  const title = document.getElementById('eventTitle').value || 'Date night ❤️';
  const dateVal = document.getElementById('eventDate').value;
  const timeVal = document.getElementById('eventTime').value || '19:00';
  const location = document.getElementById('eventLocation').value;
  const note = document.getElementById('eventNote').value;

  if (!dateVal) {
    alert('Please pick a date 💌');
    return;
  }

  const start = new Date(`${dateVal}T${timeVal}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hour default

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WillYouGoOutWithMe//EN',
    'BEGIN:VEVENT',
    'UID:' + Date.now() + '@willyougooutwithme',
    'DTSTAMP:' + formatICSDate(new Date()),
    'DTSTART:' + formatICSDate(start),
    'DTEND:' + formatICSDate(end),
    'SUMMARY:' + title.replace(/\n/g, ' '),
    'DESCRIPTION:' + (note ? note.replace(/\n/g, ' ') : ''),
    'LOCATION:' + (location ? location.replace(/\n/g, ' ') : ''),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);

  const link = document.getElementById('icsLink');
  link.href = url;

  const niceDate = start.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const niceTime = start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  document.getElementById('doneTitle').textContent = `${title} 🎉`;
  document.getElementById('doneSub').textContent = `${niceDate} at ${niceTime}` + (location ? ` — ${location}` : '');

  document.getElementById('planScreen').classList.add('hidden');
  document.getElementById('doneScreen').classList.remove('hidden');
}