// ===== Animated Background =====
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles, raf;
  const colors = ['rgba(34, 211, 238, ', 'rgba(168, 85, 247, ', 'rgba(59, 130, 246, '];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function init() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      c: colors[Math.floor(Math.random() * colors.length)],
      a: Math.random() * 0.5 + 0.2,
    }));
  }
  function loop() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      g.addColorStop(0, `${p.c}${p.a})`);
      g.addColorStop(1, `${p.c}0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
      ctx.fill();
    });
    raf = requestAnimationFrame(loop);
  }
  resize(); init(); loop();
  window.addEventListener('resize', () => { resize(); init(); });
})();

// ===== Typing effect =====
(function () {
  const el = document.getElementById('typed');
  const words = ['CSE Student', 'Aspiring Software Engineer', 'AI/ML Enthusiast'];
  let idx = 0, txt = '', deleting = false;
  function tick() {
    const cur = words[idx];
    txt = deleting ? cur.slice(0, txt.length - 1) : cur.slice(0, txt.length + 1);
    el.textContent = txt;
    let speed = deleting ? 50 : 100;
    if (!deleting && txt === cur) { speed = 1500; deleting = true; }
    else if (deleting && txt === '') { deleting = false; idx = (idx + 1) % words.length; speed = 300; }
    setTimeout(tick, speed);
  }
  tick();
})();

// ===== Navbar: mobile toggle, scroll bg, active link =====
(function () {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['home', 'about', 'skills', 'projects', 'contact'].map(id => document.getElementById(id));

  toggle.addEventListener('click', () => links.classList.toggle('open'));
  navLinks.forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  function onScroll() {
    if (window.scrollY > 30) navbar.style.background = 'rgba(11,16,32,0.85)';
    else navbar.style.background = 'rgba(11,16,32,0.6)';

    const y = window.scrollY + 120;
    let active = 'home';
    sections.forEach(s => { if (s && s.offsetTop <= y) active = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
})();

// ===== Reveal on scroll =====
(function () {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // skill bars
        e.target.querySelectorAll('.bar-item').forEach(b => {
          const v = b.dataset.value;
          b.querySelector('.bar-fill').style.width = v + '%';
        });
        // circles (build once)
        e.target.querySelectorAll('.circle-item').forEach(c => {
          if (c.dataset.built) return;
          c.dataset.built = '1';
          const value = +c.dataset.value;
          const name = c.dataset.name;
          const size = 130, stroke = 8, r = (size - stroke) / 2, cir = 2 * Math.PI * r;
          const offset = cir - (value / 100) * cir;
          c.innerHTML = `
            <svg width="${size}" height="${size}">
              <defs>
                <linearGradient id="g-${name.replace(/\s/g,'')}" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#22d3ee"/>
                  <stop offset="100%" stop-color="#a855f7"/>
                </linearGradient>
              </defs>
              <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="rgba(255,255,255,.1)" stroke-width="${stroke}" fill="none"/>
              <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="url(#g-${name.replace(/\s/g,'')})" stroke-width="${stroke}" fill="none" stroke-linecap="round" stroke-dasharray="${cir}" stroke-dashoffset="${cir}" style="transition: stroke-dashoffset 1.6s ease-out;"/>
            </svg>
            <div style="position:relative;margin-top:-${size/2 + 10}px;height:${size/2}px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;" class="text-neon">${value}%</div>
            <p class="circle-text">${name}</p>
          `;
          requestAnimationFrame(() => {
            const animCircle = c.querySelectorAll('circle')[1];
            animCircle.setAttribute('stroke-dashoffset', offset);
          });
        });
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ===== EmailJS Contact Form =====
(function () {

emailjs.init("k95dkYU2g2yMmCvI5");

const form = document.getElementById("contact-form");
const msg = document.getElementById("form-msg");

form.addEventListener("submit", function(e) {

e.preventDefault();

emailjs.sendForm(
"service_1v90err",
"template_pjhq62v",
this
)

.then(function () {

msg.innerHTML = "Message sent successfully!";
msg.className = "form-msg ok";

form.reset();

}, function (error) {

msg.innerHTML = "Failed to send message!";
msg.className = "form-msg err";

console.log(error);

});

});

})();

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80, // adjust for navbar height
        behavior: "smooth"
      });
    }
  });
});
