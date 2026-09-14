/* =========================================================
   ROMANTIC BIRTHDAY LETTER - JAVASCRIPT
   Interactive Envelope, Music Box, Confetti, Candle & Customizer
   ========================================================= */

// Default Presets
const LETTER_PRESETS = {
  romantic: {
    recipient: "Sayangku ❤️",
    sender: "Dari seseorang yang selalu menyayangimu ✨",
    date: "14 September",
    subtitle: "Untuk seseorang yang paling berharga dalam hidupku ✨",
    body: `Selamat ulang tahun untuk orang yang paling berharga dalam hidupku.

Terima kasih sudah lahir ke dunia ini, dan terima kasih sudah hadir membawa begitu banyak kehangatan, tawa, dan rasa nyaman yang tak tergantikan. Bersamamu, hal-hal sederhana berubah menjadi momen paling istimewa.

Di usiamu yang baru ini, aku berdoa semoga kamu selalu dilimpahi kesehatan, kebahagiaan tanpa batas, dan kelapangan dalam meraih setiap mimpi-mimpimu. Semoga semesta selalu memelukmu dengan kebaikan, sehangat senyummu yang selalu menerangi hariku.

Apapun yang akan kita hadapi nanti, ingatlah bahwa kamu tidak pernah berjuang sendirian. Aku akan selalu ada di sini—menjadi pendukung nomor satumu, tempatmu bercerita, dan rumah tempatmu pulang.

I love you more than words can say. Sekali lagi, selamat ulang tahun, cintaku! 💕`
  },
  playful: {
    recipient: "Si Manis Kesayanganku 🥰",
    sender: "Pacarmu yang paling beruntung memiliki kamu 💖",
    date: "14 September",
    subtitle: "Happy level up day to my favorite person! 🎉",
    body: `Happy birthday to my favorite human in the entire universe! 🎉

Selamat bertambah usia, sayang! Jangan lupa selalu bersyukur, makin dewasa, makin glowing, makin hebat, dan yang paling wajib: harus makin sayang sama aku, hehe!

Terima kasih sudah jadi teman bercanda yang seru, teman makan enak, teman curhat sampai larut malam, dan orang yang paling bisa bikin mood-ku membaik hanya dengan senyumanmu.

Semoga di usia yang baru ini semua wishlist dan resolusimu tercapai satu per satu. Jangan pernah insecure atau ragu sama kemampuanmu, karena bagiku kamu adalah sosok yang luar biasa keren.

Ayo kita rayakan hari ini dengan penuh senyuman dan kebahagiaan! I love you so much, my cutie pie! 🎂✨`
  },
  poetic: {
    recipient: "Belahan Jiwaku 🌸",
    sender: "Dengan segenap doa dan cintaku 🕊️",
    date: "14 September",
    subtitle: "Sebuah surat kecil untuk jiwa yang selalu kurindukan 🌙",
    body: `Untuk kamu yang selalu menetap di dalam doa-doaku, selamat bertambah usia.

Bumi ini begitu luas dan riuh, namun di dekatmu, aku selalu menemukan ketenangan yang tak pernah kutemukan di tempat lain. Kehadiranmu bagaikan oase yang menyejukkan hari-hariku yang lelah.

Di lembaran usiamu yang baru ini, kupanjatkan doa agar langkah kakimu senantiasa dijaga, hatimu dilapangkan dari segala gundah, dan matamu selalu berbinar menatap masa depan.

Terima kasih telah memilih untuk terus melangkah bersamaku. Semoga kita dapat terus merawat cinta ini melewati musim demi musim kehidupan.

Selamat ulang tahun, kasih. Semoga kebahagiaan sejati senantiasa memelukmu hari ini dan selamanya. 🌹`
  }
};

// Storage Key
const STORAGE_KEY = "romantic_bday_letter_data";

// DOM Elements
const envelopeSection = document.getElementById("envelopeSection");
const letterSection = document.getElementById("letterSection");
const envelope = document.getElementById("envelope");
const waxSeal = document.getElementById("waxSeal");

const displayRecipient = document.getElementById("displayRecipient");
const displaySender = document.getElementById("displaySender");
const displayDate = document.getElementById("displayDate");
const displaySubtitle = document.getElementById("displaySubtitle");
const displayLetterBody = document.getElementById("displayLetterBody");

const candle = document.getElementById("candle");
const cakeContainer = document.getElementById("cakeContainer");
const wishBanner = document.getElementById("wishBanner");
const cakeInstruction = document.getElementById("cakeInstruction");

const musicToggleBtn = document.getElementById("musicToggleBtn");
const musicIcon = document.getElementById("musicIcon");
const replayConfettiBtn = document.getElementById("replayConfettiBtn");

const customizerBtn = document.getElementById("customizerBtn");
const openCustomizerBtnBottom = document.getElementById("openCustomizerBtnBottom");
const customizerModal = document.getElementById("customizerModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveCustomizerBtn = document.getElementById("saveCustomizerBtn");
const resetDefaultsBtn = document.getElementById("resetDefaultsBtn");

const templateSelect = document.getElementById("templateSelect");
const inputRecipient = document.getElementById("inputRecipient");
const inputSender = document.getElementById("inputSender");
const inputDate = document.getElementById("inputDate");
const inputLetterBody = document.getElementById("inputLetterBody");

const filePhoto1 = document.getElementById("filePhoto1");
const filePhoto2 = document.getElementById("filePhoto2");
const filePhoto3 = document.getElementById("filePhoto3");
const polaroidImg1 = document.getElementById("polaroidImg1");
const polaroidImg2 = document.getElementById("polaroidImg2");
const polaroidImg3 = document.getElementById("polaroidImg3");

// State
let isLetterOpened = false;
let isMusicPlaying = false;
let audioCtx = null;
let musicInterval = null;

/* =========================================================
   1. LOCAL STORAGE & DATA LOADING
   ========================================================= */
function loadSavedData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      applyDataToDOM(data);
      return data;
    } catch (e) {
      console.warn("Gagal membaca data tersimpan, menggunakan default.");
    }
  }
  // Default to romantic preset
  applyDataToDOM(LETTER_PRESETS.romantic);
  return LETTER_PRESETS.romantic;
}

function applyDataToDOM(data) {
  if (data.recipient) displayRecipient.textContent = data.recipient;
  if (data.sender) displaySender.textContent = data.sender;
  if (data.date) displayDate.textContent = data.date;
  if (data.subtitle) displaySubtitle.textContent = data.subtitle;

  if (data.body) {
    // Format paragraphs
    const paragraphs = data.body.split("\n\n").filter(p => p.trim().length > 0);
    displayLetterBody.innerHTML = paragraphs.map((p, index) => {
      if (index === paragraphs.length - 1) {
        return `<p class="letter-closing-statement">${escapeHTML(p)}</p>`;
      }
      return `<p>${escapeHTML(p)}</p>`;
    }).join("");
  }

  // Load custom photos if stored
  if (data.photo1 && polaroidImg1) polaroidImg1.src = data.photo1;
  if (data.photo2 && polaroidImg2) polaroidImg2.src = data.photo2;
  if (data.photo3 && polaroidImg3) polaroidImg3.src = data.photo3;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* =========================================================
   2. ENVELOPE OPENING ANIMATION
   ========================================================= */
function openEnvelope() {
  if (isLetterOpened) return;
  isLetterOpened = true;

  envelope.classList.add("opening");

  // Play gentle sound
  initAudio();
  startMusicBox();

  // Burst initial celebratory confetti
  fireConfettiBurst();

  // Switch views after the flap opens smoothly
  setTimeout(() => {
    envelopeSection.classList.remove("active");
    letterSection.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Grand confetti celebration
    grandConfettiExplosion();
  }, 1100);
}

envelope.addEventListener("click", openEnvelope);
waxSeal.addEventListener("click", (e) => {
  e.stopPropagation();
  openEnvelope();
});

/* =========================================================
   3. CANDLE BLOW INTERACTION
   ========================================================= */
cakeContainer.addEventListener("click", () => {
  const isBlown = candle.classList.contains("blown");
  
  if (!isBlown) {
    // Blow out candle
    candle.classList.add("blown");
    wishBanner.classList.add("show");
    cakeInstruction.innerHTML = "✨ Lilin sudah ditiup! Klik lagi untuk menyalakan kembali 🔥";

    // Play sparkle sound chime
    playSparkleChime();
    
    // Confetti burst from cake
    fireConfettiBurst();
  } else {
    // Relight candle
    candle.classList.remove("blown");
    wishBanner.classList.remove("show");
    cakeInstruction.innerHTML = "🎂 <em>Buat harapan dalam hati, lalu klik lilin untuk meniupnya!</em>";
  }
});

/* =========================================================
   4. OFFLINE MUSIC BOX (WEB AUDIO API SYNTHESIZER)
   ========================================================= */
// Happy Birthday notes (frequency in Hz)
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99
};

// Gentle music box tune arrangement of Happy Birthday
const MELODY = [
  { note: NOTES.C4, dur: 350 }, { note: NOTES.C4, dur: 250 },
  { note: NOTES.D4, dur: 500 }, { note: NOTES.C4, dur: 500 },
  { note: NOTES.F4, dur: 500 }, { note: NOTES.E4, dur: 900 },

  { note: NOTES.C4, dur: 350 }, { note: NOTES.C4, dur: 250 },
  { note: NOTES.D4, dur: 500 }, { note: NOTES.C4, dur: 500 },
  { note: NOTES.G4, dur: 500 }, { note: NOTES.F4, dur: 900 },

  { note: NOTES.C4, dur: 350 }, { note: NOTES.C4, dur: 250 },
  { note: NOTES.C5, dur: 500 }, { note: NOTES.A4, dur: 500 },
  { note: NOTES.F4, dur: 500 }, { note: NOTES.E4, dur: 500 },
  { note: NOTES.D4, dur: 800 },

  { note: NOTES.B4, dur: 350 }, { note: NOTES.B4, dur: 250 },
  { note: NOTES.A4, dur: 500 }, { note: NOTES.F4, dur: 500 },
  { note: NOTES.G4, dur: 500 }, { note: NOTES.F4, dur: 1200 }
];

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playMusicBoxNote(freq, duration = 600) {
  if (!audioCtx || !isMusicPlaying) return;
  
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    // Pure bell/celesta sound
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Envelope: quick attack, exponential sweet decay
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (duration / 1000) * 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + (duration / 1000) * 1.6);
  } catch (e) {
    // Audio ignore
  }
}

function playSparkleChime() {
  initAudio();
  if (!audioCtx) return;
  const chimeNotes = [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C5 * 2];
  chimeNotes.forEach((freq, idx) => {
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.75);
      } catch(e) {}
    }, idx * 100);
  });
}

function startMusicBox() {
  initAudio();
  if (isMusicPlaying) return;
  isMusicPlaying = true;
  musicToggleBtn.classList.add("playing");
  musicIcon.textContent = "🎶";

  let step = 0;
  function playLoop() {
    if (!isMusicPlaying) return;
    const current = MELODY[step];
    playMusicBoxNote(current.note, current.dur);

    const delay = current.dur + 120;
    step = (step + 1) % MELODY.length;
    musicInterval = setTimeout(playLoop, delay);
  }
  playLoop();
}

function stopMusicBox() {
  isMusicPlaying = false;
  clearTimeout(musicInterval);
  musicToggleBtn.classList.remove("playing");
  musicIcon.textContent = "🔇";
}

musicToggleBtn.addEventListener("click", () => {
  if (isMusicPlaying) {
    stopMusicBox();
  } else {
    initAudio();
    startMusicBox();
  }
});

/* =========================================================
   5. LIGHTWEIGHT CANVASCALL CONFETTI SYSTEM
   ========================================================= */
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrameId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const CONFETTI_COLORS = ["#ff4d6d", "#ff758f", "#ffb3c1", "#e0aaff", "#ffd166", "#06d6a0", "#118ab2", "#ffffff"];

class ConfettiParticle {
  constructor(x, y, isHeart = false) {
    this.x = x;
    this.y = y;
    this.isHeart = isHeart;
    this.size = Math.random() * 8 + 6;
    this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    
    // Physics
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 9 + 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 4;
    this.gravity = 0.22;
    this.friction = 0.98;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 8;
    this.opacity = 1;
  }

  update() {
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.opacity -= 0.008;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate((this.rotation * Math.PI) / 180);
    context.globalAlpha = Math.max(0, this.opacity);
    context.fillStyle = this.color;

    if (this.isHeart) {
      // Draw small cute heart
      const h = this.size;
      context.beginPath();
      context.moveTo(0, 0);
      context.bezierCurveTo(-h/2, -h/2, -h, h/3, 0, h);
      context.bezierCurveTo(h, h/3, h/2, -h/2, 0, 0);
      context.fill();
    } else {
      // Draw ribbon/rectangle confetti
      context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
    }
    context.restore();
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height + 50);

  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });

  if (particles.length > 0) {
    animationFrameId = requestAnimationFrame(animateConfetti);
  } else {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function fireConfettiBurst(count = 70) {
  const x = window.innerWidth / 2;
  const y = window.innerHeight * 0.45;
  for (let i = 0; i < count; i++) {
    particles.push(new ConfettiParticle(x, y, Math.random() > 0.6));
  }
  if (!animationFrameId) animateConfetti();
}

function grandConfettiExplosion() {
  const bursts = [
    { x: window.innerWidth * 0.2, y: window.innerHeight * 0.3, delay: 0 },
    { x: window.innerWidth * 0.8, y: window.innerHeight * 0.3, delay: 200 },
    { x: window.innerWidth * 0.5, y: window.innerHeight * 0.2, delay: 400 },
    { x: window.innerWidth * 0.35, y: window.innerHeight * 0.4, delay: 600 },
    { x: window.innerWidth * 0.65, y: window.innerHeight * 0.4, delay: 800 }
  ];

  bursts.forEach(b => {
    setTimeout(() => {
      for (let i = 0; i < 40; i++) {
        particles.push(new ConfettiParticle(b.x, b.y, Math.random() > 0.5));
      }
      if (!animationFrameId) animateConfetti();
    }, b.delay);
  });
}

replayConfettiBtn.addEventListener("click", () => {
  grandConfettiExplosion();
  playSparkleChime();
});

/* =========================================================
   6. FLOATING BACKGROUND HEARTS GENERATOR
   ========================================================= */
const bgDecorations = document.getElementById("bgDecorations");
const ICONS = ["❤️", "💖", "🌸", "✨", "💕", "🎂", "💌"];

function spawnFloatingIcon() {
  const el = document.createElement("div");
  el.className = "floating-heart";
  el.textContent = ICONS[Math.floor(Math.random() * ICONS.length)];
  el.style.left = Math.random() * 96 + "%";
  el.style.fontSize = (Math.random() * 14 + 14) + "px";
  const duration = Math.random() * 6 + 7;
  el.style.animationDuration = duration + "s";
  
  bgDecorations.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000);
}
setInterval(spawnFloatingIcon, 1200);

/* =========================================================
   7. CUSTOMIZER MODAL (EDIT TANPA KODING)
   ========================================================= */
function openModal() {
  const currentData = loadSavedData();
  inputRecipient.value = currentData.recipient || "";
  inputSender.value = currentData.sender || "";
  inputDate.value = currentData.date || "";
  inputLetterBody.value = currentData.body || "";
  customizerModal.classList.add("open");
}

function closeModal() {
  customizerModal.classList.remove("open");
}

customizerBtn.addEventListener("click", openModal);
openCustomizerBtnBottom.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
customizerModal.addEventListener("click", (e) => {
  if (e.target === customizerModal) closeModal();
});

// Template selection handler
templateSelect.addEventListener("change", () => {
  const selectedKey = templateSelect.value;
  const template = LETTER_PRESETS[selectedKey];
  if (template) {
    inputRecipient.value = template.recipient;
    inputSender.value = template.sender;
    inputDate.value = template.date;
    inputLetterBody.value = template.body;
  }
});

// Handle custom image uploads via FileReader (persists in localStorage as base64)
function handleImageUpload(inputEl, targetImg, storageField, callback) {
  if (inputEl.files && inputEl.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      targetImg.src = e.target.result;
      callback(e.target.result);
    };
    reader.readAsDataURL(inputEl.files[0]);
  }
}

saveCustomizerBtn.addEventListener("click", () => {
  const currentSaved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  
  const updatedData = {
    ...currentSaved,
    recipient: inputRecipient.value.trim() || "Sayangku ❤️",
    sender: inputSender.value.trim() || "Dari seseorang yang selalu menyayangimu ✨",
    date: inputDate.value.trim() || "14 September",
    body: inputLetterBody.value.trim() || LETTER_PRESETS.romantic.body
  };

  // Check photos
  const saveAll = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    applyDataToDOM(updatedData);
    closeModal();
    grandConfettiExplosion();
    alert("✨ Surat berhasil diperbarui dan disimpan! ❤️");
  };

  let pendingLoads = 0;

  if (filePhoto1.files[0]) {
    pendingLoads++;
    handleImageUpload(filePhoto1, polaroidImg1, "photo1", (base64) => {
      updatedData.photo1 = base64;
      if (--pendingLoads === 0) saveAll();
    });
  }
  if (filePhoto2.files[0]) {
    pendingLoads++;
    handleImageUpload(filePhoto2, polaroidImg2, "photo2", (base64) => {
      updatedData.photo2 = base64;
      if (--pendingLoads === 0) saveAll();
    });
  }
  if (filePhoto3.files[0]) {
    pendingLoads++;
    handleImageUpload(filePhoto3, polaroidImg3, "photo3", (base64) => {
      updatedData.photo3 = base64;
      if (--pendingLoads === 0) saveAll();
    });
  }

  if (pendingLoads === 0) {
    saveAll();
  }
});

resetDefaultsBtn.addEventListener("click", () => {
  if (confirm("Kembalikan tulisan dan foto ke awal?")) {
    localStorage.removeItem(STORAGE_KEY);
    applyDataToDOM(LETTER_PRESETS.romantic);
    polaroidImg1.src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80";
    polaroidImg2.src = "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&auto=format&fit=crop&q=80";
    polaroidImg3.src = "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&auto=format&fit=crop&q=80";
    closeModal();
  }
});

/* =========================================================
   8. INITIALIZATION ON LOAD
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  loadSavedData();
});
