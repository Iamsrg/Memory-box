// ==========================================
// 🔑 NOTIFICATION SETUP (PUT YOUR KEY HERE)
// ==========================================
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE"; // Get free at web3forms.com

// --- EMAIL NOTIFICATION SENDER ---
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

// --- AUDIO SYNTHESIZER ---
class SuperheroAudio {
  constructor() { this.ctx = null; }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  playIronMan() {
    this.init();
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
    this.init();
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
    this.init();
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
    this.init();
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
    this.init();
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

// --- SPIDER-MAN HEXAGONAL SPIDER-WEB ANIMATION ---
function shootWebSorry() {
  audio.playSpidey();
  let canvas = document.getElementById('spidey-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxRadius = Math.min(canvas.width, canvas.height) * 0.42;

  let progress = 0;

  function drawHexWeb() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.shadowColor = "#00f3ff";
    ctx.shadowBlur = 12;
    ctx.lineWidth = 3;

    // 1. Draw 6 Radial Spokes (Hexagonal axes)
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = cx + Math.cos(angle) * maxRadius * Math.min(progress, 1);
      const y = cy + Math.sin(angle) * maxRadius * Math.min(progress, 1);
      
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // 2. Draw Concentric Hexagonal Rings
    if (progress > 0.3) {
      const ringProgress = Math.min((progress - 0.3) / 0.7, 1);
      const ringCount = 5;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
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

    // 3. Reveal Glowing Center Text "I AM SORRY!"
    if (progress >= 1) {
      ctx.shadowColor = "#ff2a6d";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 clamp(2rem, 5vw, 3.8rem) 'Poppins', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("🕸️ I AM SORRY! 🕷️", cx, cy);

      setTimeout(() => {
        let fade = setInterval(() => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          clearInterval(fade);
        }, 3000);
      }, 1200);
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
    if (pieces.some(p => p.y < canvas.height)) requestAnimationFrame(animate);
  }
  animate();
}