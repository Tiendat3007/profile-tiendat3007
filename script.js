/* =========================================================
   PHẠM HUỲNH TIẾN ĐẠT — PORTFOLIO INTERACTIONS
   ========================================================= */
(() => {
  'use strict';

  /* ---------- Config: chỉnh thông tin cá nhân tại đây ---------- */
  const CONFIG = {
    name: 'Phạm Huỳnh Tiến Đạt',
    birthDay: 30,
    birthMonth: 7, // tháng 7
    birthYear: 2006,
    enrollYear: 2024, // năm nhập học PTIT
    email: 'tiendat3007@gmail.com',
    github: 'https://github.com/Tiendat3007',
    roles: [
      'Sinh viên Công nghệ Thông tin @ PTIT',
      'Front-end Developer',
      'Người yêu thích UI/UX',
      'Problem Solver 🧩',
      'Lifelong Learner 🚀'
    ]
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const body = document.body;

  /* ---------- Dynamic personal data ---------- */
  function calcAge(now = new Date()) {
    let age = now.getFullYear() - CONFIG.birthYear;
    const bdayThisYear = new Date(now.getFullYear(), CONFIG.birthMonth - 1, CONFIG.birthDay);
    if (now < bdayThisYear) age--;
    return age;
  }
  function calcStudyYear(now = new Date()) {
    // Năm học mới bắt đầu từ tháng 9
    const y = now.getFullYear() - CONFIG.enrollYear + (now.getMonth() >= 8 ? 1 : 0);
    return clamp(y, 1, 5);
  }
  $$('.js-age').forEach(el => (el.textContent = calcAge()));
  $$('.js-study-year').forEach(el => (el.textContent = calcStudyYear()));
  $$('.js-email-link').forEach(el => (el.href = `mailto:${CONFIG.email}`));
  $$('.js-email-text').forEach(el => (el.textContent = CONFIG.email));
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg, type = 'ok') {
    if (!toastEl) return;
    const icon = type === 'warn' ? 'fa-circle-exclamation' : 'fa-circle-check';
    toastEl.className = `toast ${type === 'warn' ? 'warn' : ''}`;
    toastEl.innerHTML = `<i class="fa-solid ${icon}"></i><span></span>`;
    toastEl.querySelector('span').textContent = msg;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  /* ---------- Preloader ---------- */
  const preloader = $('#preloader');
  const preFill = $('#preloader-fill');
  const preCount = $('#preloader-count');
  let pageLoaded = document.readyState === 'complete';
  let counted = false;
  let finished = false;

  function finishLoading() {
    if (finished || !pageLoaded || !counted) return;
    finished = true;
    setTimeout(() => {
      preloader && preloader.classList.add('done');
      body.classList.remove('loading');
      body.classList.add('is-loaded');
      onReady();
    }, 180);
  }

  const preStart = performance.now();
  const PRE_DUR = prefersReduced ? 200 : 1400;
  (function preTick(t) {
    const p = clamp((t - preStart) / PRE_DUR, 0, 1);
    const v = Math.round((1 - Math.pow(1 - p, 3)) * 100);
    if (preFill) preFill.style.width = v + '%';
    if (preCount) preCount.textContent = v + '%';
    if (p < 1) requestAnimationFrame(preTick);
    else { counted = true; finishLoading(); }
  })(preStart);

  window.addEventListener('load', () => { pageLoaded = true; finishLoading(); });
  setTimeout(() => { pageLoaded = true; finishLoading(); }, 4500); // fallback

  /* ---------- Called once the preloader is gone ---------- */
  function onReady() {
    initReveal();
    startTyping();
    initTerminal();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$('.reveal, .reveal-scale');
    els.forEach(el => {
      const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal') || c.classList.contains('reveal-scale'));
      const i = sibs.indexOf(el);
      el.style.setProperty('--delay', Math.min(i * 0.08, 0.48) + 's');
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        io.unobserve(el);
        const delay = parseFloat(el.style.getPropertyValue('--delay')) || 0;
        // Gỡ class sau khi chạy xong để không xung đột với hiệu ứng tilt/hover
        setTimeout(() => {
          el.classList.remove('reveal', 'reveal-scale', 'in');
          el.style.removeProperty('--delay');
        }, 1300 + delay * 1000);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => io.observe(el));
  }

  /* ---------- Typing effect ---------- */
  function startTyping() {
    const el = $('#typed-text');
    if (!el) return;
    if (prefersReduced) { el.textContent = CONFIG.roles[0]; return; }
    let r = 0, i = 0, deleting = false;
    el.textContent = '';
    (function loop() {
      const word = CONFIG.roles[r];
      const chars = [...word];
      if (!deleting) {
        i++;
        el.textContent = chars.slice(0, i).join('');
        if (i === chars.length) { deleting = true; return setTimeout(loop, 1900); }
        return setTimeout(loop, 55 + Math.random() * 50);
      }
      i--;
      el.textContent = chars.slice(0, i).join('');
      if (i === 0) { deleting = false; r = (r + 1) % CONFIG.roles.length; return setTimeout(loop, 350); }
      setTimeout(loop, 28);
    })();
  }

  /* ---------- Terminal ---------- */
  const terminal = $('#terminal');
  const TERM_SCRIPT = [
    { cmd: 'whoami', out: [`<span class="c-gold">${CONFIG.name}</span>`] },
    {
      cmd: 'cat profile.json',
      out: [
        '{',
        '  <span class="c-red">"born"</span>:   <span class="c-gold">"30/07/2006"</span>,',
        '  <span class="c-red">"school"</span>: <span class="c-gold">"PTIT"</span>,',
        '  <span class="c-red">"major"</span>:  <span class="c-gold">"Công nghệ Thông tin"</span>,',
        `  <span class="c-red">"year"</span>:   <span class="c-gold">${calcStudyYear()}</span>,`,
        '  <span class="c-red">"status"</span>: <span class="c-gold">"learning &amp; building 🚀"</span>',
        '}'
      ]
    },
    { cmd: 'echo $MOTTO', out: ['<span class="c-green">"Code with passion, build with purpose."</span>'] }
  ];
  const PROMPT = '<span class="c-green">dat@ptit</span>:<span class="c-gold">~</span>$ ';

  function runTerminal() {
    if (!terminal) return;
    let html = '';
    const render = (extra = '') => { terminal.innerHTML = html + extra + '<span class="caret"></span>'; };

    if (prefersReduced) {
      TERM_SCRIPT.forEach(s => { html += PROMPT + s.cmd + '\n' + s.out.join('\n') + '\n\n'; });
      html += PROMPT; render(); return;
    }

    let step = 0;
    function typeCmd() {
      if (step >= TERM_SCRIPT.length) { html += PROMPT; render(); return; }
      const { cmd, out } = TERM_SCRIPT[step];
      let c = 0;
      (function typeChar() {
        render(PROMPT + cmd.slice(0, c));
        if (c < cmd.length) { c++; return setTimeout(typeChar, 60 + Math.random() * 60); }
        html += PROMPT + cmd + '\n';
        let o = 0;
        (function printLine() {
          if (o < out.length) { html += out[o++] + '\n'; render(); return setTimeout(printLine, 90); }
          html += '\n'; step++;
          setTimeout(typeCmd, 500);
        })();
      })();
    }
    typeCmd();
  }
  if (terminal) terminal.innerHTML = PROMPT + '<span class="caret"></span>';
  function initTerminal() {
    if (!terminal) return;
    const tio = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { tio.disconnect(); setTimeout(runTerminal, 400); }
    }, { threshold: 0.4 });
    tio.observe(terminal);
  }

  /* ---------- Birthday countdown ---------- */
  const cd = { d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-mins'), s: $('#cd-secs') };
  const bdayNote = $('#bday-note');
  function updateCountdown() {
    if (!cd.d) return;
    const now = new Date();
    const isToday = now.getMonth() === CONFIG.birthMonth - 1 && now.getDate() === CONFIG.birthDay;
    if (isToday) {
      $('#countdown').innerHTML = '<div style="grid-column:1/-1"><span class="bday-msg gradient-text">🎉 Hôm nay là sinh nhật Đạt!</span></div>';
      if (bdayNote) bdayNote.textContent = `Chúc mừng tuổi ${calcAge()}! 🎂`;
      return true;
    }
    let next = new Date(now.getFullYear(), CONFIG.birthMonth - 1, CONFIG.birthDay);
    if (now >= next) next = new Date(now.getFullYear() + 1, CONFIG.birthMonth - 1, CONFIG.birthDay);
    const diff = next - now;
    const pad = n => String(n).padStart(2, '0');
    cd.d.textContent = Math.floor(diff / 864e5);
    cd.h.textContent = pad(Math.floor(diff / 36e5) % 24);
    cd.m.textContent = pad(Math.floor(diff / 6e4) % 60);
    cd.s.textContent = pad(Math.floor(diff / 1e3) % 60);
    if (bdayNote) bdayNote.textContent = `đến sinh nhật lần thứ ${calcAge() + 1} · 30/07 🎂`;
    return false;
  }
  if (!updateCountdown()) {
    const cdTimer = setInterval(() => { if (updateCountdown()) clearInterval(cdTimer); }, 1000);
  }

  /* ---------- Particle constellation background ---------- */
  const canvas = $('#bg-canvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, particles = [];
    const mouse = { x: -9999, y: -9999 };
    const LINK = 125, MOUSE_LINK = 170;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = clamp(Math.floor((w * h) / 17000), 28, 95);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.5,
        gold: Math.random() > 0.45
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReduced) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
        }
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.16;
            ctx.strokeStyle = `rgba(245,199,107,${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        const mx = p.x - mouse.x, my = p.y - mouse.y;
        const md = Math.sqrt(mx * mx + my * my);
        if (md < MOUSE_LINK) {
          ctx.strokeStyle = `rgba(255,77,109,${(1 - md / MOUSE_LINK) * 0.45})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = p.gold ? 'rgba(245,199,107,0.75)' : 'rgba(255,77,109,0.75)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function loop() {
      if (!document.hidden) draw();
      requestAnimationFrame(loop);
    }

    resize();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (prefersReduced) draw(); }, 150); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });
    if (prefersReduced) draw(); else loop();
  }

  /* ---------- Custom cursor ---------- */
  if (!isTouch) {
    const dot = $('#cursor-dot'), ring = $('#cursor-ring');
    if (dot && ring) {
      let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
      window.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        body.classList.add('has-cursor');
      }, { passive: true });
      document.addEventListener('mouseleave', () => body.classList.remove('has-cursor'));
      (function follow() {
        rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
        requestAnimationFrame(follow);
      })();
      const hoverSel = 'a, button, input, textarea, .tab-btn, .hobbies li, [data-tilt]';
      document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) ring.classList.add('hover'); });
      document.addEventListener('mouseout', e => { if (e.target.closest(hoverSel)) ring.classList.remove('hover'); });
    }
  }

  /* ---------- Navigation ---------- */
  const nav = $('#nav');
  const progress = $('#scroll-progress');
  const indicator = $('#nav-indicator');
  const navLinks = $$('.nav-link');
  const timeline = $('#timeline');
  const tlFill = $('#tl-fill');
  const tlItems = $$('.tl-item');

  function moveIndicator(link) {
    if (!indicator || !link || !link.offsetWidth) return;
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = `translateX(${link.offsetLeft - 5}px)`;
  }
  function setActive(id) {
    navLinks.forEach(l => {
      const on = l.dataset.section === id;
      l.classList.toggle('active', on);
      if (on) moveIndicator(l);
    });
  }

  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (nav) nav.classList.toggle('scrolled', y > 30);

    if (timeline && tlFill) {
      const r = timeline.getBoundingClientRect();
      const trigger = window.innerHeight * 0.6;
      const p = clamp((trigger - r.top) / r.height, 0, 1);
      tlFill.style.height = p * 100 + '%';
      tlItems.forEach(item => {
        const dot = item.querySelector('.tl-dot');
        if (dot) item.classList.toggle('active', dot.getBoundingClientRect().top < trigger);
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', () => moveIndicator($('.nav-link.active')));
  onScroll();
  // Đợi font load để đo kích thước chính xác
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => moveIndicator($('.nav-link.active')));

  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => sectionIO.observe(s));

  /* ---------- Mobile menu ---------- */
  const burger = $('#nav-burger');
  const mMenu = $('#mobile-menu');
  function toggleMenu(force) {
    if (!burger || !mMenu) return;
    const open = typeof force === 'boolean' ? force : !mMenu.classList.contains('open');
    mMenu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    body.style.overflow = open ? 'hidden' : '';
  }
  burger && burger.addEventListener('click', () => toggleMenu());
  $$('.mobile-link').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  /* ---------- Marquee (nhân đôi nội dung để chạy liền mạch) ---------- */
  const track = $('#marquee-track');
  if (track) track.innerHTML += track.innerHTML;

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const dur = 1800, start = performance.now();
    (function step(t) {
      const p = clamp((t - start) / dur, 0, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); countIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- Skill rings ---------- */
  const CIRC = 2 * Math.PI * 36;
  function fillRing(card) {
    const ring = card.querySelector('.skill-ring');
    if (!ring || ring.dataset.done) return;
    ring.dataset.done = '1';
    const pct = +ring.dataset.pct || 0;
    const bar = ring.querySelector('.bar');
    const label = card.querySelector('.skill-pct');
    if (bar) bar.style.strokeDashoffset = CIRC * (1 - pct / 100);
    if (label) {
      const start = performance.now(), dur = prefersReduced ? 1 : 1800;
      (function step(t) {
        const p = clamp((t - start) / dur, 0, 1);
        label.textContent = Math.round(pct * (1 - Math.pow(1 - p, 3))) + '%';
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }
  }
  const ringIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { setTimeout(() => fillRing(e.target), 300); ringIO.unobserve(e.target); } });
  }, { threshold: 0.5 });
  $$('.skill-card').forEach(c => ringIO.observe(c));

  /* ---------- Filters (skills & projects) ---------- */
  function setupFilter(tabsSel, itemsSel, onShow) {
    const tabs = $$(`${tabsSel} .tab-btn`);
    const items = $$(itemsSel);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
      const f = tab.dataset.filter;
      let idx = 0;
      items.forEach(item => {
        const cats = (item.dataset.cat || '').split(' ');
        const show = f === 'all' || cats.includes(f);
        item.classList.remove('pop-in');
        item.classList.toggle('is-hidden', !show);
        if (show) {
          void item.offsetWidth; // restart animation
          item.style.animationDelay = (idx++ * 0.06) + 's';
          item.classList.add('pop-in');
          onShow && onShow(item);
        }
      });
    }));
  }
  setupFilter('#skill-tabs', '#skills-grid .skill-card', fillRing);
  setupFilter('#project-tabs', '#projects-grid .project-card');

  /* ---------- Card spotlight ---------- */
  document.addEventListener('pointermove', e => {
    const card = e.target.closest && e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* ---------- 3D tilt & magnetic (desktop only) ---------- */
  if (!isTouch && !prefersReduced) {
    $$('[data-tilt]').forEach(el => {
      const max = +el.dataset.tilt || 8;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });

    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.translate = `${x * 0.25}px ${y * 0.35}px`;
      });
      el.addEventListener('mouseleave', () => { el.style.translate = ''; });
    });
  }

  /* ---------- Copy email ---------- */
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
      return ok;
    }
  }
  $$('[data-copy-email]').forEach(btn => btn.addEventListener('click', async () => {
    const ok = await copyText(CONFIG.email);
    toast(ok ? `Đã sao chép: ${CONFIG.email}` : 'Không thể sao chép, vui lòng thử lại', ok ? 'ok' : 'warn');
  }));

  /* ---------- Contact form → mailto ---------- */
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const f = form.elements;
      const name = f.namedItem('name').value.trim();
      const email = f.namedItem('email').value.trim();
      const subject = f.namedItem('subject').value.trim();
      const message = f.namedItem('message').value.trim();
      if (!name || !email || !message) return toast('Vui lòng điền đầy đủ các trường bắt buộc (*)', 'warn');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast('Địa chỉ email chưa hợp lệ', 'warn');

      const mailBody = `Xin chào Đạt,\n\n${message}\n\n—\n${name}\n${email}`;
      const href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject || `Liên hệ từ ${name} qua Portfolio`)}&body=${encodeURIComponent(mailBody)}`;
      window.location.href = href;
      toast('Đang mở ứng dụng email của bạn... ✉️');
      form.reset();
    });
  }

  /* ---------- Console greeting ---------- */
  console.log(
    '%c TĐ %c Xin chào! Cảm ơn bạn đã ghé thăm portfolio của Phạm Huỳnh Tiến Đạt 🚀',
    'background:linear-gradient(120deg,#ff4d6d,#f5c76b);color:#22050b;font-weight:900;padding:4px 8px;border-radius:6px',
    'color:#f5c76b;font-weight:600'
  );
})();
