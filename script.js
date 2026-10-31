/* ==========================================================================
   MISSION CONTROL FOR IT SUPPORT — JAVASCRIPT
   Simon Joseph K | Technical Support Engineer
   ========================================================================== */

/**
 * SAFETY NET: UNBREAKABLE PRELOADER HIDER
 * Ensures the preloader is removed even if other scripts fail.
 */
(function() {
  function forceHidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        preloader.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scroll
      }, 400);
    }
  }
  // Safety timeout: 2.5 seconds max for preloader
  setTimeout(forceHidePreloader, 2500);
  // Window load fallback
  window.addEventListener('load', forceHidePreloader);
})();

document.addEventListener('DOMContentLoaded', () => {

  // ── Preloader ──────────────────────────────────────────────────────────
  function finishPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.4s ease';
    setTimeout(() => { preloader.style.display = 'none'; }, 400);
  }
  try {
    const preloader = document.getElementById('preloader');
    let preProgress = 0;
    const preInterval = setInterval(() => {
      preProgress += Math.random() * 20;
      if (preProgress >= 100) {
        preProgress = 100;
        clearInterval(preInterval);
        setTimeout(finishPreloader, 400);
      }
      const bar = document.getElementById('preloaderBar');
      const pct = document.getElementById('preloaderPercent');
      if (bar) bar.style.width = `${preProgress}%`;
      if (pct) pct.innerText = `${Math.floor(preProgress)}%`;
    }, 180);
    // Fallback: always remove preloader within 2.5s
    setTimeout(finishPreloader, 2500);
  } catch (e) { finishPreloader(); }

  // ── Theme Toggle ───────────────────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('portfolio-theme'); } catch (e) { savedTheme = null; }
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.innerText = savedTheme === 'light' ? '☀️' : '🌙';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      const icon = document.getElementById('themeIcon');
      if (icon) icon.innerText = next === 'light' ? '☀️' : '🌙';
      try { localStorage.setItem('portfolio-theme', next); } catch (e) { /* ignore */ }
    });
  }

  // ── Floating Navbar Shrink ─────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinksEl = document.getElementById('navLinks');
  const mobileToggle = document.getElementById('mobileToggle');
  const isTouch = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navLinksEl.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });
    navLinksEl.addEventListener('click', e => {
      if (e.target.closest('.nav-link')) {
        navLinksEl.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    navbar.style.padding = scroll > 60 ? '0.5rem 1.2rem' : '0.75rem 1.5rem';

    // Scroll progress bar
    const total = document.body.scrollHeight - window.innerHeight;
    if (total > 0) {
      document.getElementById('scrollProgress').style.width = `${(scroll / total) * 100}%`;
    }
  });

  // ── Active Section Highlight ───────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinkElements = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkElements.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -60% 0px' });
  sections.forEach(sec => sectionObserver.observe(sec));

  // ── Scroll Reveal ──────────────────────────────────────────────────────
  // Threshold 0 with a bottom rootMargin keeps animations alive even when
  // the browser is zoomed out (smaller viewport ratio) — the element only
  // pauses once it is genuinely off-screen (>200px past the viewport).
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        entry.target.querySelectorAll('.counter').forEach(triggerCounter);
      } else if (entry.boundingClientRect.bottom < -200 || entry.boundingClientRect.top > window.innerHeight + 200) {
        entry.target.classList.remove('reveal-active');
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  document.querySelectorAll('.reveal, .stat-card').forEach(el => revealObserver.observe(el));
  // Safety net: force every reveal element visible after 3s regardless of
  // IntersectionObserver quirks (zoomed-out viewports, lazy observers).
  setTimeout(() => {
    document.querySelectorAll('.reveal, .stat-card').forEach(el => {
      el.classList.add('reveal-active');
    });
    document.querySelectorAll('.counter').forEach(el => {
      if (!el.dataset.counted) triggerCounter(el);
    });
    document.querySelectorAll('.counter-range').forEach(el => {
      if (!el.dataset.counted) triggerRangeCounter(el);
    });
    setAllFinalValues();
  }, 3000);

  function triggerCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const counter = el.querySelector('.counter');
    if (!counter) return;
    const target = +counter.dataset.target;
    let current = 0;
    const step = target / 60;
    function tick() {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(tick);
      } else {
        counter.textContent = target;
      }
    }
    tick();
  }

  function triggerRangeCounter(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = 'true';
    const min = +el.dataset.min;
    const max = +el.dataset.max;
    let cur = min;
    const step = (max - min) / 40;
    function tick() {
      cur += step;
      if (cur < max) {
        el.textContent = `${Math.floor(cur)}-${max}`;
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${min}-${max}`;
      }
    }
    tick();
  }

  function setRingFill(ring, percent) {
    if (!ring) return;
    const p = Math.max(0, Math.min(100, percent));
    ring.setAttribute('stroke-dasharray', `${p}, 100`);
  }

  function setAllFinalValues() {
    document.querySelectorAll('.counter').forEach(el => {
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      const target = +el.dataset.target;
      el.textContent = target;
    });
    document.querySelectorAll('.counter-range').forEach(el => {
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      el.textContent = `${el.dataset.min}-${el.dataset.max}`;
    });
    document.querySelectorAll('.ring-fill').forEach(ring => {
      const target = +ring.dataset.target;
      if (!isNaN(target)) setRingFill(ring, target);
    });
  }

  // Assign data-target to rings so they fill to the matching value.
  document.querySelectorAll('.ring-fill.ring-cyan').forEach(r => r.dataset.target = '98');
  document.querySelectorAll('.ring-fill.ring-violet').forEach(r => r.dataset.target = '30');

  // Animate counters when the stats section scrolls into view.
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter').forEach(triggerCounter);
          entry.target.querySelectorAll('.counter-range').forEach(triggerRangeCounter);
          entry.target.querySelectorAll('.ring-fill').forEach(r => {
            const t = +r.dataset.target;
            if (!isNaN(t)) setRingFill(r, t);
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    statsObserver.observe(statsSection);
  }

  // Fallbacks: set final values immediately if section already visible,
  // IntersectionObserver unavailable, or prefers-reduced-motion is on.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window && !reducedMotion;
  if (!canObserve) {
    setAllFinalValues();
  } else if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight) {
    setAllFinalValues();
  }
  setTimeout(setAllFinalValues, 3000);

  // ── Canvas Particle Network ────────────────────────────────────────────
  const canvas = document.getElementById('bgCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    let particles = [];

    function seedParticles() {
      // Density scales with canvas area so zoomed-out viewports still get
      // a visible network (clamped to keep small phones light).
      const count = isTouch
        ? 25
        : Math.max(30, Math.min(140, Math.floor((W * H) / 18000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 1.5 + 0.5
      }));
    }
    seedParticles();

    // Re-seed on resize/zoom so the network never collapses to a dot pattern.
    let resizeTimer;
    window.addEventListener('resize', () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(seedParticles, 150);
    });
    // Live update particle count when coarse-pointer media query changes.
    const mql = window.matchMedia('(pointer: coarse)');
    mql.addEventListener('change', () => { isTouch = mql.matches; seedParticles(); });
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        if (mouse.x !== null) {
          const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dm < 160) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── Typewriter ─────────────────────────────────────────────────────────
  const roles = [
    'Technical Support Engineer',
    'Incident Resolver',
    'Identity & Access Specialist',
    'Data-Driven Problem Solver'
  ];
  const twEl = document.getElementById('typewriterText');
  let twRole = 0, twChar = 0, twDeleting = false;
  function typewriter() {
    const word = roles[twRole];
    if (twDeleting) {
      // Never let twChar drop below 0 — that caused an infinite delete loop.
      if (twChar > 0) {
        twEl.textContent = word.substring(0, twChar - 1);
        twChar--;
      }
      if (twChar <= 0) {
        twDeleting = false;
        twRole = (twRole + 1) % roles.length;
        setTimeout(typewriter, 400);
        return;
      }
      setTimeout(typewriter, 40);
    } else {
      twEl.textContent = word.substring(0, twChar + 1);
      twChar++;
      if (twChar >= word.length) {
        setTimeout(() => { twDeleting = true; typewriter(); }, 2200);
        return;
      }
      setTimeout(typewriter, 80);
    }
  }
  typewriter();

  // ── Skills Filter ──────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      skillCards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'block' : 'none';
      });
    });
  });

  // ── Experience Timeline Toggle ─────────────────────────────────────────
  document.querySelectorAll('.exp-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.exp-card');
      card.classList.toggle('active');
      btn.querySelector('.toggle-icon').textContent = card.classList.contains('active') ? '−' : '+';
    });
  });

  // ── 3D Tilt Effect (desktop only) ──────────────────────────────────────
  if (!isTouch) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.width / 2, cy = rect.height / 2;
        const dx = (e.clientX - rect.left - cx) / cx;
        const dy = (e.clientY - rect.top - cy) / cy;
        card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-3px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
      });
    });
  }

  // ── Custom Glow Cursor (desktop only) ──────────────────────────────────
  const glow = document.getElementById('glowCursor');
  const dot = document.getElementById('cursorDot');
  if (!isTouch) {
    glow.style.display = 'block';
    dot.style.display = 'block';
    window.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
      dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
    });
  }

  
  // ── Mail Composer ──────────────────────────────────────────────────────
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
  function showError(msg) {
    const el = document.getElementById('composerError');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }
  function showSuccess() {
    const el = document.getElementById('composerSuccess');
    if (el) el.style.display = 'block';
  }

  const sendBtn = document.getElementById('sendEmailBtn');
  const gmailBtn = document.getElementById('openGmailBtn');
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyConfirm = document.getElementById('copyConfirm');
  const eName = document.getElementById('eName');
  const eEmail = document.getElementById('eEmail');
  const eSubject = document.getElementById('eSubject');
  const eMessage = document.getElementById('eMessage');
  const EMAIL = 'simonjoseph.sk@gmail.com';

  function gatherMailData() {
    const name = (eName && eName.value || '').trim();
    const email = (eEmail && eEmail.value || '').trim();
    const subject = (eSubject && eSubject.value || '').trim();
    const message = (eMessage && eMessage.value || '').trim();
    if (!name) { showError('Please enter your name.'); return null; }
    if (!email) { showError('Please enter your email.'); return null; }
    if (!validateEmail(email)) { showError('Please enter a valid email address.'); return null; }
    if (!message) { showError('Please write your message.'); return null; }
    return { name, email, subject, message };
  }

  function buildBody(data) {
    return `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const data = gatherMailData();
      if (!data) return;
      const subject = encodeURIComponent(data.subject || 'Hello from your portfolio');
      const body = encodeURIComponent(buildBody(data));
      showSuccess();
      window.location = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    });
  }

  if (gmailBtn) {
    gmailBtn.addEventListener('click', () => {
      const data = gatherMailData();
      if (!data) return;
      const subject = encodeURIComponent(data.subject || 'Hello from your portfolio');
      const body = encodeURIComponent(buildBody(data));
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${subject}&body=${body}`, '_blank', 'noopener noreferrer');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(() => {
          if (copyConfirm) { copyConfirm.style.display = 'inline'; }
          setTimeout(() => { if (copyConfirm) copyConfirm.style.display = 'none'; }, 2000);
        }).catch(() => fallbackCopy(EMAIL));
      } else {
        fallbackCopy(EMAIL);
        if (copyConfirm) { copyConfirm.style.display = 'inline'; }
        setTimeout(() => { if (copyConfirm) copyConfirm.style.display = 'none'; }, 2000);
      }
    });
  }

  // ── Command Palette ────────────────────────────────────────────────────
  const palette = document.getElementById('cmdPalette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdList = document.getElementById('cmdList');
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');

  const commands = [
    { label: 'Home', section: 'hero' },
    { label: 'About', section: 'about' },
    { label: 'Skills', section: 'skills' },
    { label: 'Experience', section: 'experience' },
    { label: 'Projects', section: 'project' },
    { label: 'Education', section: 'education' },
    { label: 'Beyond Work', section: 'beyond-work' },
    { label: 'Creations', section: 'creations' },
    { label: 'Contact', section: 'contact' },
    { label: 'Open LinkedIn', section: 'linkedin' },
    { label: 'Chat with Simon\'s Buddy', action: 'buddy' },
    { label: 'Play the drums', action: 'drums' }
  ];

  function openPalette() {
    palette.style.display = 'grid';
    cmdInput.focus();
    renderCommands('');
  }
  function closePalette() {
    palette.style.display = 'none';
    cmdInput.value = '';
  }
  function renderCommands(q) {
    cmdList.innerHTML = '';
    const filtered = commands.filter(c =>
      c.label.toLowerCase().includes(q.toLowerCase())
    );
    filtered.slice(0, 8).forEach((cmd, i) => {
      const li = document.createElement('li');
      li.className = 'cmd-item' + (i === 0 ? ' active' : '');
      li.textContent = cmd.label;
      li.addEventListener('click', () => {
        if (cmd.action === 'buddy') {
          openBuddyWindow();
        } else if (cmd.action === 'drums') {
          // Scroll to Beyond Work and switch to Drums mode
          const bw = document.getElementById('beyond-work');
          if (bw) bw.scrollIntoView({ behavior: 'smooth' });
          const drumsBtn = document.querySelector('.mt-btn[data-mode="drums"]');
          if (drumsBtn) drumsBtn.click();
        } else if (cmd.section === 'linkedin') {
          window.open('https://www.linkedin.com/in/simon-joseph-k-887528306', '_blank', 'noopener noreferrer');
        } else {
          document.getElementById(cmd.section).scrollIntoView({ behavior: 'smooth' });
        }
        closePalette();
      });
      cmdList.appendChild(li);
    });
  }

  cmdPaletteBtn.addEventListener('click', openPalette);
  document.getElementById('cmdOverlay').addEventListener('click', closePalette);
  cmdInput.addEventListener('input', e => renderCommands(e.target.value));
  document.addEventListener('keydown', e => {
    // Never hijack keys while the user is typing in a form field.
    const tag = (e.target.tagName || '').toLowerCase();
    const isEditable = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;
    if (isEditable) return;
    if (e.key === '/') { e.preventDefault(); openPalette(); }
    if (e.key === 'Escape') closePalette();
  });

  // ── Simon's Buddy Floating Terminal ────────────────────────────────────
  const footerTerm = document.getElementById('footerTerminal');
  const ftClose = document.getElementById('ftClose');

  const footerToggle = document.createElement('button');
  footerToggle.className = 'ft-toggle-glass-btn';
  footerToggle.textContent = '🖥️';
  footerToggle.setAttribute('aria-label', 'Open Simon\'s Buddy');
  footerToggle.style.cssText = `
    position: fixed; bottom: 1rem; right: 1rem; z-index: 1001;
    width: 44px; height: 44px; border-radius: 10px; font-size: 1.3rem;
    background: rgba(5,7,13,0.8); border: 1px solid rgba(34,211,238,0.3);
    cursor: pointer; backdrop-filter: blur(8px); pointer-events: auto;
  `;
  document.body.appendChild(footerToggle);

  function openBuddyWindow() {
    if (!footerTerm) return;
    footerTerm.classList.add('open');
    const input = document.getElementById('buddyInput');
    if (input) setTimeout(() => input.focus(), 250);
  }
  function closeBuddyWindow() {
    if (!footerTerm) return;
    footerTerm.classList.remove('open');
  }

  footerToggle.addEventListener('click', () => {
    if (footerTerm && footerTerm.classList.contains('open')) closeBuddyWindow();
    else openBuddyWindow();
  });
  if (ftClose) ftClose.addEventListener('click', closeBuddyWindow);

  // ── Back to Top ────────────────────────────────────────────────────────
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── My Web Creations ──────────────────────────────────────────────────
  try {
    const grid = document.getElementById('creationsGrid');
    if (grid && window.CREATIONS) {
      if (window.CREATIONS.length === 0) {
        grid.innerHTML = '<p class="creations-fallback">More websites coming soon.</p>';
      } else {
        window.CREATIONS.forEach(c => {
          const card = document.createElement('a');
          card.href = (c.url.startsWith('https://') || c.url.startsWith('http://') || c.url.startsWith('#')) ? c.url : '#';
          if (c.url.startsWith('http')) card.target = '_blank';
          card.className = 'creation-card glass-panel tilt-card reveal';
          card.setAttribute('aria-label', `Visit ${c.title}`);
          const domain = c.url.startsWith('http') ? new URL(c.url).hostname : 'simonjosephk7.github.io';

          card.innerHTML = `
            <div class="creation-preview" style="background:${c.accent || '#333'}">
              ${c.image ? `<img src="${c.image}" alt="${c.title}" onerror="this.style.display='none';this.parentElement.querySelector('.gen-preview').style.display='flex'">` : ''}
              <div class="gen-preview" style="${c.image ? 'display:none' : 'display:flex'}">
                <div class="mini-browser">
                  <div class="mb-bar"><span></span><span></span><span></span></div>
                  <div class="mb-body"><span>${c.title}</span></div>
                </div>
              </div>
              <div class="scanline"></div>
            </div>
            <div class="creation-content">
              <h3>${c.title}</h3>
              <p class="creation-domain">${domain}</p>
              <p class="creation-desc">${c.description}</p>
              <div class="creation-tech">
                ${c.tech.map(t => `<span class="badge">${t}</span>`).join('')}
              </div>
              <span class="btn btn-secondary">Visit Site ↗</span>
            </div>
          `;
          grid.appendChild(card);
        });
      }
    }
  } catch (e) { console.error('Creations error:', e); }

  // ── Hobbies: Drum Kit ───────────────────────────────────────────────────
  try {
    const drumKitEl = document.getElementById('drumKit');
    const drumSvg = document.getElementById('drumSvg');
    const drumHint = document.getElementById('drumHint');
    const drumWaveform = document.getElementById('drumWaveform');
    if (!drumKitEl || !drumSvg) return;

    let isClosedHiHat = true;
    let audioCtx = null;
    let masterGain = null;
    let compressor = null;

    function ensureAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0.6;
        compressor = audioCtx.createDynamicsCompressor();
        compressor.threshold.value = -24;
        compressor.knee.value = 30;
        compressor.ratio.value = 12;
        compressor.attack.value = 0.003;
        compressor.release.value = 0.25;
        masterGain.connect(compressor);
        compressor.connect(audioCtx.destination);
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    // Sound generators
    function playKick() {
      const ctx = ensureAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain).connect(masterGain);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
      spawnRipple(); spawnNote('#f5b942'); jumpWaveform();
    }

    function playSnare() {
      const ctx = ensureAudio();
      // Noise burst
      const bufLen = ctx.sampleRate * 0.2;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const nFilter = ctx.createBiquadFilter(); nFilter.type = 'highpass'; nFilter.frequency.value = 1000;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.8, ctx.currentTime);
      nGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      noise.connect(nFilter).connect(nGain).connect(masterGain);
      noise.start(); noise.stop(ctx.currentTime + 0.2);
      // Triangle body
      const osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = 180;
      const oscGain = ctx.createGain();
      oscGain.gain.setValueAtTime(0.5, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(oscGain).connect(masterGain);
      osc.start(); osc.stop(ctx.currentTime + 0.15);
      spawnNote('#22d3ee'); jumpWaveform();
    }

    function playHiHat(open) {
      const ctx = ensureAudio();
      const dur = open ? 0.3 : 0.05;
      const bufLen = ctx.sampleRate * dur;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource(); noise.buffer = buf;
      const filter = ctx.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 7000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      noise.connect(filter).connect(gain).connect(masterGain);
      noise.start(); noise.stop(ctx.currentTime + dur);
      isClosedHiHat = !open;
      spawnNote('#8b5cf6'); jumpWaveform();
    }

    function playTom(low) {
      const ctx = ensureAudio();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startFreq = low ? 160 : 220;
      const endFreq = low ? 90 : 120;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.7, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain).connect(masterGain);
      osc.start(); osc.stop(ctx.currentTime + 0.25);
      spawnNote('#10b981'); jumpWaveform();
    }

    function playCrash() {
      const ctx = ensureAudio();
      const dur = 1.0;
      const bufLen = ctx.sampleRate * dur;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource(); noise.buffer = buf;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5000;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 8000; bp.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      noise.connect(hp).connect(bp).connect(gain).connect(masterGain);
      noise.start(); noise.stop(ctx.currentTime + dur);
      animateCymbal('crash'); spawnNote('#f59e0b'); jumpWaveform();
    }

    function playRide() {
      const ctx = ensureAudio();
      const dur = 0.6;
      const bufLen = ctx.sampleRate * dur;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource(); noise.buffer = buf;
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      noise.connect(hp).connect(gain).connect(masterGain);
      noise.start(); noise.stop(ctx.currentTime + dur);
      [880, 1320, 1760].forEach(freq => {
        const osc = ctx.createOscillator(); osc.type = 'square'; osc.frequency.value = freq;
        const g = ctx.createGain(); g.gain.value = 0.05;
        osc.connect(g).connect(masterGain); osc.start(); osc.stop(ctx.currentTime + dur);
      });
      animateCymbal('ride'); spawnNote('#f59e0b'); jumpWaveform();
    }

    const soundMap = { kick: playKick, snare: playSnare, hihat: () => playHiHat(isClosedHiHat), tom1: () => playTom(false), tom2: () => playTom(true), floor: () => playTom(true), crash: playCrash, ride: playRide };

    // Visual feedback
    function animateCymbal(id) {
      const el = drumSvg?.querySelector(`[data-sound="${id}"]`);
      if (el) { el.classList.remove('wobble'); void el.offsetWidth; el.classList.add('wobble'); }
    }
    function spawnRipple() {
      if (!drumSvg || !document.querySelector('[style*="reduced-motion"]')) return;
      const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ripple.setAttribute('cx', '60'); ripple.setAttribute('cy', '70');
      ripple.setAttribute('r', '10'); ripple.setAttribute('fill', 'none');
      ripple.setAttribute('stroke', '#f5b942'); ripple.setAttribute('stroke-width', '2');
      ripple.style.animation = 'rippleOut 0.5s ease-out forwards';
      drumSvg.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }
    function spawnNote(color) {
      if (!drumKitEl) return;
      const note = document.createElement('span');
      note.textContent = ['♪', '♫', '♩'][Math.floor(Math.random() * 3)];
      note.style.cssText = `position:absolute;left:${30 + Math.random() * 40}%;bottom:24px;color:${color};font-size:14px;pointer-events:none;z-index:2;animation:floatUp 0.8s ease-out forwards;`;
      drumKitEl.appendChild(note);
      setTimeout(() => note.remove(), 800);
    }
    function jumpWaveform() {
      if (!drumWaveform) return;
      drumWaveform.querySelectorAll('.wf-bar').forEach(bar => {
        const h = 4 + Math.random() * 16;
        bar.style.height = h + 'px';
        setTimeout(() => { bar.style.height = '4px'; }, 100);
      });
    }
    // Build waveform bars
    if (drumWaveform) {
      for (let i = 0; i < 20; i++) {
        const bar = document.createElement('div');
        bar.className = 'wf-bar';
        drumWaveform.appendChild(bar);
      }
    }


    // Drum piece clicks
    drumSvg?.addEventListener('pointerdown', e => {
      const piece = e.target.closest('.drum-piece');
      if (!piece) return;
      e.preventDefault();
      const sound = piece.dataset.sound;
      soundMap[sound]?.();
      piece.classList.remove('hit'); void piece.offsetWidth;
      piece.classList.add('hit');
    });

    // Keyboard mapping: A S D F J K L
    const keyMap = { a: 'hihat', s: 'snare', d: 'kick', f: 'tom1', g: 'tom2', h: 'floor', j: 'crash', k: 'ride' };
    document.addEventListener('keydown', e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
      if (e.key === '/' || e.ctrlKey || e.metaKey) return;
      const sound = keyMap[e.key.toLowerCase()];
      if (sound) {
        e.preventDefault();
        soundMap[sound]?.();
        const el = drumSvg?.querySelector(`[data-sound="${sound}"]`);
        if (el) { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
      }
    });
    drumSvg?.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const piece = e.target.closest('.drum-piece');
        if (piece) {
          const sound = piece.dataset.sound;
          soundMap[sound]?.();
          piece.classList.remove('hit'); void piece.offsetWidth;
          piece.classList.add('hit');
        }
      }
    });
  } catch (e) { console.error('Drum kit error:', e); }

  // ── Hobbies: Code Editor Typing Animation ──────────────────────────────
  const codeBody = document.getElementById('codeBody');
  if (codeBody) {
    // Fixed-size box: 6 short lines, each under 32 chars, so the card never grows.
    const snippet = [
      '<span class="c-tag">&lt;div</span> <span class="c-attr">class=</span><span class="c-str">"portfolio"</span><span class="c-tag">&gt;</span>',
      '  <span class="c-tag">&lt;h1</span><span class="c-tag">&gt;</span>Simon<span class="c-tag">&lt;/h1&gt;</span>',
      '  <span class="c-tag">&lt;section</span> <span class="c-attr">id=</span><span class="c-str">"about"</span><span class="c-tag">&gt;</span>',
      '    <span class="c-comment">// mission control</span>'
    ];
    // Pre-build the fixed number of lines so the box height never changes.
    const lines = snippet.map(() => document.createElement('div'));
    lines.forEach((line, i) => { line.className = 'code-line'; line.innerHTML = snippet[i]; codeBody.appendChild(line); });

    let lineIdx = 0, charIdx = 0, isDeleting = false;
    const cursor = document.createElement('span');
    cursor.className = 'code-cursor';
    cursor.textContent = '│';
    codeBody.appendChild(cursor);

    function typeCode() {
      const line = lines[lineIdx];
      if (!isDeleting) {
        line.innerHTML = snippet[lineIdx].substring(0, charIdx + 1);
        charIdx++;
      } else {
        line.innerHTML = snippet[lineIdx].substring(0, charIdx);
        charIdx--;
      }
      // Keep the cursor inline at the end of the current line.
      line.appendChild(cursor);

      let delay = isDeleting ? 25 : 40;
      if (!isDeleting && charIdx === snippet[lineIdx].length) {
        delay = 500; isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % snippet.length;
        delay = 150;
      }
      setTimeout(typeCode, delay);
    }
    typeCode();
  }

  // ── Hobbies: Travel Journey Animation ──────────────────────────────────
  try {
    const scene = document.getElementById('travelScene');
    const celestial = document.getElementById('tsCelestial');
    const plane = document.getElementById('tsPlane');
    const balloon = document.getElementById('tsBalloon');
    const needle = document.getElementById('compassNeedle');
    const captions = document.getElementById('psCaptions');
    const chips = document.getElementById('placesChips');
    const note = document.getElementById('placeNote');
    if (!scene || !celestial || !plane) return;

    // Hide elements that need animation init
    [balloon, needle].forEach(el => { if (el) el.style.display = 'none'; });

    const landmarks = ['Mountains', 'Beaches', 'Forests', 'Cities', 'Heritage'];
    const destinations = [
      { x: 25, y: 35, cap: '🏔️ Reaching the peaks', time: 2 },
      { x: 75, y: 70, cap: '🏖️ Sunset on the shore', time: 5 },
      { x: 140, y: 25, cap: '🌲 Deep in the forest', time: 8 },
      { x: 210, y: 60, cap: '🏙️ City skyline ahead', time: 10 },
      { x: 270, y: 20, cap: '🛕 Ancient heritage site', time: 12 }
    ];
    let animFrame = null;
    let startTime = null;
    const CYCLE = 12000; // 12s loop
    let currentLandmark = -1;

    function resetScene() {
      plane.style.transition = 'none';
      plane.style.transform = 'translate(0, 0)';
      if (captionEl) captionEl.remove();
      captionEl = null;
      if (note) note.textContent = '';
      landmarks.forEach((_, i) => {
        const chip = chips?.querySelector(`[data-place="${landmarks[i].toLowerCase()}"]`);
        if (chip) chip.classList.remove('active');
      });
    }
    let captionEl = null;

    function animateJourney(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = (elapsed % CYCLE) / CYCLE;

      // Sun/Moon cycle (day to night)
      const isDay = progress < 0.5;
      celestial.style.background = isDay
        ? 'radial-gradient(circle at 30% 30%, #fff3c4, #f59e0b)'
        : 'radial-gradient(circle at 30% 30%, #e2e8f0, #64748b)';
      celestial.style.boxShadow = isDay
        ? '0 0 12px rgba(245,158,11,0.6)'
        : '0 0 8px rgba(148,163,184,0.4)';

      // Move plane along path using simple easing
      const x = 10 + progress * 260;
      const y = 80 - Math.sin(progress * Math.PI * 2) * 50;
      plane.style.transform = `translate(${x}px, ${y}px)`;

      // Detect landmark arrival
      landmarks.forEach((lm, i) => {
        const dest = destinations[i];
        const destProgress = dest.time / (CYCLE / 1000);
        if (Math.abs(progress * CYCLE - dest.time * 1000) < 400 && currentLandmark !== i) {
          currentLandmark = i;
          if (note) note.textContent = `✅ ${dest.cap}`;
          const chip = chips?.querySelector(`[data-place="${lm.toLowerCase()}"]`);
          if (chip) chip.classList.add('active');
          // Create floating caption
          if (captions) {
            if (captionEl) captionEl.remove();
            captionEl = document.createElement('div');
            captionEl.className = 'ps-caption-pop';
            captionEl.textContent = dest.cap;
            captions.appendChild(captionEl);
            setTimeout(() => { if (captionEl) captionEl.remove(); captionEl = null; }, 1800);
          }
        }
      });

      // Rotating compass needle
      if (needle) {
        needle.style.transform = `rotate(${(progress * 360) % 360}deg)`;
        needle.style.display = 'block';
      }

      // Balloon drift
      if (balloon) {
        balloon.style.transform = `translate(${Math.sin(ts * 0.001) * 8}px, ${Math.cos(ts * 0.0013) * 5}px)`;
        balloon.style.display = 'block';
      }

      animFrame = requestAnimationFrame(animateJourney);
    }

    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          resetScene();
          startTime = null;
          if (animFrame) cancelAnimationFrame(animFrame);
          animFrame = requestAnimationFrame(animateJourney);
        } else {
          if (animFrame) cancelAnimationFrame(animFrame);
          animFrame = null;
        }
      });
    }, { threshold: 0 });
    observer.observe(scene);

    // Chip click handler
    if (chips) {
      chips.addEventListener('click', (e) => {
        const chip = e.target.closest('.place-chip');
        if (!chip) return;
        landmarks.forEach((lm, i) => {
          if (chip.dataset.place === lm.toLowerCase()) {
            currentLandmark = i;
            const dest = destinations[i];
            if (note) note.textContent = `▶️ Starting: ${dest.cap}`;
            const others = chips.querySelectorAll('.place-chip');
            others.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            // Restart animation from beginning
            resetScene();
            startTime = null;
            if (animFrame) cancelAnimationFrame(animFrame);
            animFrame = requestAnimationFrame(animateJourney);
          }
        });
      });
    }
  } catch (e) { console.error('Travel animation error:', e); }

  // ── Hobbies: Tab Switching ──────────────────────────────────────────────
  try {
    const bwTabs = document.getElementById('bwTabs');
    const panels = document.querySelectorAll('.bw-tabs-panel');
    if (bwTabs && panels.length) {
      bwTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.bw-tab');
        if (!btn) return;
        const target = btn.dataset.tab;
        bwTabs.querySelectorAll('.bw-tab').forEach(b => b.classList.toggle('active', b === btn));
        panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      });
    }
  } catch (e) { console.error('Tab switching error:', e); }

  // ── Equalizer animation ────────────────────────────────────────────────
  const equalizer = document.getElementById('equalizer');
  if (equalizer) {
    const bars = equalizer.querySelectorAll('span');
    bars.forEach((bar, i) => {
      bar.style.animation = `eqBounce 0.8s ease-in-out ${i * 0.1}s infinite`;
    });
  }

  // ── Konami Code → Confetti ─────────────────────────────────────────────
  const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIdx = 0;
  document.addEventListener('keydown', e => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
    if (e.keyCode === konamiSequence[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSequence.length) {
        launchConfetti();
        konamiIdx = 0;
      }
    } else {
      konamiIdx = 0;
    }
  });

  // ── Confetti ───────────────────────────────────────────────────────────
  const confettiCanvas = document.getElementById('confettiCanvas');
  if (confettiCanvas) {
    const cCtx = confettiCanvas.getContext('2d');
    confettiCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
    let confettiPieces = [];
    let confettiRaf;

    function launchConfetti() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
      confettiPieces = Array.from({ length: 150 }, () => ({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 200,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: ['#22d3ee', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'][Math.floor(Math.random() * 5)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rot: Math.random() * 360,
        rv: (Math.random() - 0.5) * 10
      }));
      if (confettiRaf) cancelAnimationFrame(confettiRaf);
      function drawConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        let alive = false;
        confettiPieces.forEach(p => {
          p.x += p.vx; p.y += p.vy; p.rot += p.rv; p.vy += 0.1;
          if (p.y < confettiCanvas.height + 20) alive = true;
          cCtx.save();
          cCtx.translate(p.x, p.y);
          cCtx.rotate((p.rot * Math.PI) / 180);
          cCtx.fillStyle = p.color;
          cCtx.globalAlpha = 0.9;
          cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          cCtx.restore();
        });
        if (alive) confettiRaf = requestAnimationFrame(drawConfetti);
      }
      drawConfetti();
    }
    window._launchConfetti = launchConfetti;
  }

  // ── Simon's Buddy Chat ───────────────────────────────────────────────
  try {
    const buddyInput = document.getElementById('buddyInput');
    const buddySend = document.getElementById('buddySend');
    const buddyBody = document.getElementById('buddyBody');
    const buddyQuick = document.getElementById('buddyQuick');

    if (!buddyInput || !buddySend || !buddyBody) throw new Error('Missing elements');

    const replies = {
      'hi': 'Hi! I\'m Simon\'s buddy 👋 Ask me anything about Simon.',
      'hello': 'Hi! I\'m Simon\'s buddy 👋 Ask me anything about Simon.',
      'about': 'Simon Joseph K is a Technical Support Engineer in Bengaluru with close to 2 years of experience at IBM and Kyndryl.',
      'skills': 'Simon works in ServiceNow, Okta, Azure/Entra ID, Intune, Microsoft 365, and uses Excel, Power BI, SQL, and Python for reporting.',
      'experience': 'Simon has worked at IBM (Technical Support Engineer, 02/2025–05/2026) and Kyndryl (Senior Customer Service Associate, 06/2026–Present).',
      'projects': 'Simon\'s projects include a "Sales Performance Analysis Dashboard" (SQL, Excel, Power BI) and this portfolio website.',
      'hobbies': 'Simon enjoys playing musical instruments, creating webpages, and exploring new places.',
      'creations': 'Simon has built several websites including earlier portfolios and this mission-control themed site.',
      'contact': 'Email: <a href="mailto:simonjoseph.sk@gmail.com">simonjoseph.sk@gmail.com</a> | Phone: <a href="tel:+918618709741">+91 8618709741</a>',
      'linkedin': 'Connect on LinkedIn: <a href="https://www.linkedin.com/in/simon-joseph-k-887528306" target="_blank" rel="noopener noreferrer">Simon Joseph K</a>',
      'resume': 'You can download Simon\'s resume <a href="./Simon_Joseph_K_Resume.pdf" target="_blank" download>here</a>.',
      'hire': 'Simon is open to Technical Support, IT Service Desk, Identity & Access, or Endpoint support roles. Email him to discuss!'
    };

    function addMessage(text, isMe) {
      const div = document.createElement('div');
      div.className = `bubble ${isMe ? 'me' : 'buddy'}`;
      div.innerHTML = text;
      buddyBody.appendChild(div);
      buddyBody.scrollTop = buddyBody.scrollHeight;
    }

    function showTyping() {
      const div = document.createElement('div');
      div.className = 'bubble buddy';
      div.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
      buddyBody.appendChild(div);
      buddyBody.scrollTop = buddyBody.scrollHeight;
      return div;
    }

    function getReply(input) {
      const msg = input.toLowerCase();
      for (const key in replies) {
        if (msg.includes(key)) return replies[key];
      }
      return "I'm not sure about that, try the chips below or email Simon.";
    }

    // Terminal Commands
    function processCommand(input) {
      const cmd = input.toLowerCase().trim();
      if (cmd === 'creations') {
        if (!window.CREATIONS || window.CREATIONS.length === 0) return "No creations listed.";
        return "<b>My Web Creations:</b><br>" + window.CREATIONS.map(c => `- ${c.title} (${c.url})`).join('<br>');
      }
      return null;
    }

    function sendMessage() {
      const val = buddyInput.value.trim();
      if (!val) return;
      addMessage(val, true);
      buddyInput.value = '';
      const typing = showTyping();
      setTimeout(() => {
        if (typing.parentNode) buddyBody.removeChild(typing);
        const cmdResult = processCommand(val);
        addMessage(cmdResult || getReply(val), false);
      }, 1000);
    }

    buddySend.addEventListener('click', sendMessage);
    buddyInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });
    document.getElementById('buddyInputRow').addEventListener('click', () => buddyInput.focus());

    ['About', 'Skills', 'Experience', 'Projects', 'Creations', 'Hobbies', 'Contact', 'LinkedIn'].forEach(chip => {
      const btn = document.createElement('button');
      btn.className = 'quick-chip';
      btn.textContent = chip;
      btn.onclick = () => { buddyInput.value = chip; sendMessage(); };
      buddyQuick.appendChild(btn);
    });

    // Open buddy window with typing indicator on first open
    const ftToggle = document.querySelector('.ft-toggle-glass-btn');
    let buddyOpened = false;
    if (ftToggle && footerTerm) {
      ftToggle.addEventListener('click', () => {
        if (!buddyOpened) {
          buddyOpened = true;
          const typing = showTyping();
          setTimeout(() => {
            if (typing.parentNode) buddyBody.removeChild(typing);
            addMessage("Hi! I'm Simon's buddy 👋 Ask me anything about Simon.", false);
          }, 1500);
        }
      });
    }
  } catch (e) { console.error('Buddy init error:', e); }

}); // end DOMContentLoaded
