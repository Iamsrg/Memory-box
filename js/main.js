// ==========================================
// 🔊 GLOBAL AUDIO CONTROLLER (SEAMLESS CROSS-PAGE AUDIO)
// ==========================================
class GlobalAudioController {
  constructor() {
    this.audio = null;
    this.currentSrc = null;
  }

  playTrack(src, loop = false, startOffset = 0) {
    if (!src) return;

    if (this.audio && this.currentSrc === src && !this.audio.paused) {
      return;
    }

    this.stopTrack(false);

    this.audio = new Audio(src);
    this.currentSrc = src;
    this.audio.loop = loop;
    this.audio.volume = 0.8;

    if (startOffset > 0) {
      this.audio.currentTime = startOffset;
    }

    sessionStorage.setItem('marvel_audio_src', src);
    sessionStorage.setItem('marvel_audio_time', this.audio.currentTime.toString());
    sessionStorage.setItem('marvel_audio_timestamp', Date.now().toString());
    sessionStorage.setItem('marvel_audio_loop', loop ? 'true' : 'false');

    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const handleUserGesture = () => {
          if (this.audio) this.audio.play().catch(() => {});
          window.removeEventListener('click', handleUserGesture);
          window.removeEventListener('touchstart', handleUserGesture);
        };
        window.addEventListener('click', handleUserGesture);
        window.addEventListener('touchstart', handleUserGesture);
      });
    }

    this.audio.ontimeupdate = () => {
      if (this.audio) {
        sessionStorage.setItem('marvel_audio_time', this.audio.currentTime.toString());
        sessionStorage.setItem('marvel_audio_timestamp', Date.now().toString());
      }
    };

    this.audio.onended = () => {
      if (!loop) {
        this.clearSessionStorage();
      }
    };
  }

  stopTrack(clearSession = true) {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
      this.currentSrc = null;
    }
    if (clearSession) {
      this.clearSessionStorage();
    }
  }

  clearSessionStorage() {
    sessionStorage.removeItem('marvel_audio_src');
    sessionStorage.removeItem('marvel_audio_time');
    sessionStorage.removeItem('marvel_audio_timestamp');
    sessionStorage.removeItem('marvel_audio_loop');
  }

  restoreSessionAudio(fallbackBgMusic = null) {
    const src = sessionStorage.getItem('marvel_audio_src');
    const timeStr = sessionStorage.getItem('marvel_audio_time');
    const timestampStr = sessionStorage.getItem('marvel_audio_timestamp');
    const loopStr = sessionStorage.getItem('marvel_audio_loop');

    if (src && timeStr && timestampStr) {
      const savedTime = parseFloat(timeStr);
      const timestamp = parseInt(timestampStr, 10);
      const isLoop = loopStr === 'true';

      const elapsed = (Date.now() - timestamp) / 1000;
      const targetTime = savedTime + elapsed;

      this.playTrack(src, isLoop, targetTime);
    } else if (fallbackBgMusic) {
      this.playTrack(fallbackBgMusic, true, 0);
    }
  }
}

const globalAudio = new GlobalAudioController();

// Navigate with Hero Audio (Plays single-play audio across page navigation)
function navigateWithHeroSound(event, targetUrl, heroAudioPath) {
  event.preventDefault();

  if (heroAudioPath) {
    globalAudio.playTrack(heroAudioPath, false, 0);
  }

  document.body.classList.remove("page-loaded");
  document.body.classList.add("page-exiting");

  setTimeout(() => {
    window.location.href = targetUrl;
  }, 450);
}

// Global Page Load Setup
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-loaded");

  document.querySelectorAll("a, .back-btn").forEach(link => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("#") && !href.startsWith("javascript")) {
        if (link.getAttribute("onclick") && link.getAttribute("onclick").includes("navigateWithHeroSound")) {
          return;
        }
        e.preventDefault();
        document.body.classList.remove("page-loaded");
        document.body.classList.add("page-exiting");
        setTimeout(() => {
          window.location.href = href;
        }, 400);
      }
    });
  });
});

// ==========================================
// 🔑 NOTIFICATION SETUP
// ==========================================
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; // Get free at web3forms.com

async function sendNotification(subject, message) {
  if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
    console.log("Notification trigger simulated:", subject, message);
    return;
  }
  
  try {
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: subject,
        message: message,
        from_name: "Marvel Memory Vault"
      })
    });
  } catch (err) {
    console.error("Failed to send notification:", err);
  }
}

// ==========================================
// 🔊 SYNTHESIZER SOUND EFFECTS FOR INTERACTION
// ==========================================
class SuperheroAudio {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playIronMan() {
    this.init(); if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.3);
  }

  playSpidey() {
    this.init(); if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.15);
  }

  playStrange() {
    this.init(); if (!this.ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5 + idx * 0.05);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + idx * 0.05); osc.stop(this.ctx.currentTime + 0.5 + idx * 0.05);
    });
  }

  playCap() {
    this.init(); if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.25);
  }

  playLoki() {
    this.init(); if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(); osc.stop(this.ctx.currentTime + 0.25);
  }
}

const audio = new SuperheroAudio();

// ==========================================
// 🕸️ SPIDER-MAN WEB SHOOTER
// ==========================================
function shootWebSorry() {
  globalAudio.playTrack('music/spider_man_web_shot.mp3', false, 0);
  let canvas = document.getElementById('spidey-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;

  let progress = 0;
  let alpha = 1.0;

  function drawHexWeb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgba(10, 12, 16, ${alpha})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
    ctx.shadowColor = "#00f3ff";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3;

    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = cx + Math.cos(angle) * maxRadius * Math.min(progress, 1);
      const y = cy + Math.sin(angle) * maxRadius * Math.min(progress, 1);
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (progress > 0.3) {
      const ringProgress = Math.min((progress - 0.3) / 0.7, 1);
      const ringCount = 5;

      ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * alpha})`;
      ctx.lineWidth = 2;

      for (let r = 1; r <= ringCount; r++) {
        const radius = (maxRadius / ringCount) * r * ringProgress;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    if (progress >= 1) {
      ctx.shadowColor = "#ff2a6d";
      ctx.shadowBlur = 30;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      
      const fontSize = Math.max(26, Math.min(window.innerWidth * 0.05, 52));
      ctx.font = `900 ${fontSize}px 'Poppins', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🕸️ I AM SORRY! 🕷️", cx, cy);

      setTimeout(() => {
        let fadeInterval = setInterval(() => {
          alpha -= 0.05;
          if (alpha <= 0) {
            clearInterval(fadeInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = `rgba(10, 12, 16, ${alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.shadowColor = "#ff2a6d";
            ctx.shadowBlur = 30;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = `900 ${fontSize}px 'Poppins', sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("🕸️ I AM SORRY! 🕷️", cx, cy);
          }
        }, 30);
      }, 1000);
      return;
    }

    progress += 0.05;
    requestAnimationFrame(drawHexWeb);
  }

  drawHexWeb();
}

// --- CONFETTI EFFECT ---
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#00f3ff', '#ff2a6d', '#ffd700', '#00e676', '#e63946'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 5 + 2,
      angle: Math.random() * 360
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speed;
      p.angle += 2;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    if (pieces.some(p => p.y < canvas.height)) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  animate();
}

// ==========================================
// 🌠 COSMIC STARFIELD & INTRO TIMELINE
// ==========================================
let stars = [];
let starSpeed = 0.3;

function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.5 + 0.1,
      color: ['#ffffff', '#00f3ff', '#ffd700', '#ff2a6d'][Math.floor(Math.random() * 4)]
    });
  }

  function render() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
      s.y -= s.speed * starSpeed;
      if (s.y < 0) s.y = canvas.height;

      s.alpha += (Math.random() - 0.5) * 0.05;
      if (s.alpha < 0.2) s.alpha = 0.2;
      if (s.alpha > 1) s.alpha = 1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = s.alpha;
      ctx.fill();
    });

    requestAnimationFrame(render);
  }
  render();
}

function runIntroTimeline() {
  setTimeout(() => {
    const threat = document.getElementById('introThreat');
    if (threat) threat.classList.add('visible');
  }, 1000);

  setTimeout(() => {
    const msg = document.getElementById('introMessage');
    if (msg) msg.classList.add('visible');
  }, 2800);

  setTimeout(() => {
    const btn = document.getElementById('getHelpBtn');
    if (btn) btn.classList.add('visible');
  }, 4800);
}

function triggerGetHelpSequence() {
  globalAudio.playTrack('music/avengers_assemble.mp3', false, 0);
  starSpeed = 18;

  const container = document.querySelector('.intro-container');
  if (container) {
    container.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    container.style.opacity = "0";
    container.style.transform = "scale(1.2)";
  }

  setTimeout(() => {
    window.location.href = "hub.html";
  }, 900);
}