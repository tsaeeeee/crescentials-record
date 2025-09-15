const navLink = document.querySelectorAll('.nav__link')

function linkColor(){
    navLink.forEach(link => link.classList.remove('active-link'))
    this.classList.add('active-link')
}
navLink.forEach(link => link.addEventListener('click', linkColor))

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tagline flicker - Updated for new structure
  const taglineLines = document.querySelectorAll(".tagline-line");
  
  taglineLines.forEach(line => {
    const text = line.textContent;
    line.textContent = "";

    [...text].forEach(char => {
      const span = document.createElement("span");
      if (char === " ") {
        span.innerHTML = "&nbsp;";
      } else {
        span.textContent = char;
        span.classList.add("flicker-char");
        span.style.setProperty("--delay", (Math.random() * 3).toFixed(3));
      }

      line.appendChild(span);
    });
  });

  // 2. Preloader animation
  gsap.fromTo(
    "#preloader",
    { opacity: 1 },
    {
      opacity: 0,
      duration: 1,
      delay: 4,
      onComplete: () => {
        const preloader = document.getElementById("preloader");
        preloader.style.opacity = "0";
        preloader.style.display = "none";
        preloader.style.pointerEvents = "none";
        preloader.remove(); // atau hapus aja kalau mau ilang total
      }
    }
  );

// 3. Wave Animation - Reusable untuk beberapa canvas
function createWaveAnimation(canvasId, color = "#FFD900") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let phases = [];
  let shadowPhases = [];
  let t = 0;
  const waveResolution = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = 200;
  }

  function initPhases() {
    phases = [];
    shadowPhases = [];
    for (let x = 0; x < canvas.width; x += waveResolution) {
      phases.push(Math.random() * Math.PI * 2);
      shadowPhases.push(Math.random() * Math.PI * 2);
    }
  }

  function drawWave(phaseArray, yOffset, color, amplitude = 15, alpha = 1) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2 + yOffset);

    for (let i = 0; i < phaseArray.length; i++) {
      const x = i * waveResolution;
      const y =
        Math.sin(t + phaseArray[i]) * amplitude * (
          0.6 + Math.sin(phaseArray[i] * 3 + t * 0.2) * 0.4
        );
      ctx.lineTo(x, canvas.height / 2 + y + yOffset);
    }

    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWave(shadowPhases, -40, "rgba(255, 217, 0, 0.4)", 20, 0.4);
    drawWave(phases, -40, color, 18, 1);
    t += 0.03;
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  initPhases();
  animate();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initPhases();
  });
}

  createWaveAnimation("waveCanvas");       // Home section
  createWaveAnimation("waveCanvasAbout");  // About section
});

document.addEventListener("mousemove", (e) => {
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  const mouseX = Math.round((e.pageX / winWidth) * 100);
  const mouseY = Math.round((e.pageY / winHeight) * 100);

  document.body.style.setProperty("--mouse-x", `${mouseX}%`);
  document.body.style.setProperty("--mouse-y", `${mouseY}%`);
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').replace('#', '');

    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });

    document.getElementById(targetId).classList.add('active');
  });
});