/* Teilen Teens — interacciones del sitio */
(() => {
  const C = window.TEILEN_CONFIG || {};
  const $ = (q, c = document) => c.querySelector(q);
  const $$ = (q, c = document) => Array.from(c.querySelectorAll(q));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Enlaces centralizados (assets/config.js) ---------- */
  const startUrl = C.assessmentUrl || 'https://www.teilenteens.com/login';
  $$('[data-start]').forEach(a => a.setAttribute('href', startUrl));
  $$('[data-login]').forEach(a => a.setAttribute('href', C.loginUrl || startUrl));
  $$('[data-email]').forEach(a => {
    const subject = a.getAttribute('data-email');
    a.setAttribute('href', 'mailto:' + (C.supportEmail || 'talento@teilenteens.com') + (subject ? '?subject=' + encodeURIComponent(subject) : ''));
  });
  $$('[data-whatsapp]').forEach(a => {
    const msg = a.getAttribute('data-whatsapp') || 'Hola, quisiera recibir información sobre Teilen Teens.';
    a.href = 'https://wa.me/' + (C.whatsappInternational || '5493517623874') + '?text=' + encodeURIComponent(msg);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  });
  $$('[data-newsletter]').forEach(a => { a.href = C.newsletter || '#'; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  $$('[data-instagram]').forEach(a => { a.href = C.instagram || '#'; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
  $$('[data-checkout]').forEach(a => { a.href = C.checkoutUrl || startUrl; });

  /* Compartir con la familia: mensaje informativo general.
     NO desbloquea una evaluación concreta: ese enlace lo genera el backend (familyCheckoutUrl). */
  const familyMsg = 'Hola, encontré Teilen Teens. Respondo la evaluación en unos 5 minutos sin tarjeta. ' +
    'Si quiero el informe completo de Identidad Evolutiva (5 páginas + 5 preguntas a Salomón IA), cuesta USD 50. ¿Lo vemos juntos? ' +
    (C.siteUrl || 'https://www.teilenteens.com/');
  $$('[data-family-share]').forEach(a => {
    a.href = 'https://wa.me/?text=' + encodeURIComponent(familyMsg);
    a.target = '_blank'; a.rel = 'noopener noreferrer';
  });

  /* ---------- Header ---------- */
  const hdr = $('.hdr');
  const onScroll = () => hdr && hdr.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const more = $('.more');
  if (more) {
    const btn = $('button', more);
    const close = () => { more.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const open = more.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => { if (!more.contains(e.target)) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  const mm = $('.mobile-menu');
  $$('[data-menu-open]').forEach(b => b.addEventListener('click', () => {
    mm.classList.add('open'); document.body.classList.add('lock');
    b.setAttribute('aria-expanded', 'true'); $('[data-menu-close]', mm)?.focus();
  }));
  const closeMenu = () => {
    mm?.classList.remove('open'); document.body.classList.remove('lock');
    $$('[data-menu-open]').forEach(b => b.setAttribute('aria-expanded', 'false'));
  };
  $$('[data-menu-close]').forEach(b => b.addEventListener('click', closeMenu));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mm?.classList.contains('open')) closeMenu(); });

  /* ---------- Respuesta rotativa del hero ---------- */
  $$('[data-rotate]').forEach(el => {
    const words = JSON.parse(el.getAttribute('data-rotate'));
    const w = $('.rot-word', el);
    if (!w || reduce || words.length < 2) return;
    let i = 0;
    setInterval(() => {
      w.classList.add('out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        w.textContent = words[i];
        w.classList.remove('out'); w.classList.add('pre');
        void w.offsetWidth;
        w.classList.remove('pre');
      }, 330);
    }, 2400);
  });

  /* ---------- Pestañas por audiencia ---------- */
  $$('[data-tabs]').forEach(root => {
    const tabs = $$('[role="tab"]', root);
    const select = (t, focus) => {
      tabs.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select(tabs[(i + 1) % tabs.length], true); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select(tabs[(i - 1 + tabs.length) % tabs.length], true); }
      });
    });
  });

  /* ---------- Informe de ejemplo: abanico + visor ---------- */
  const pages = [
    ['reporte-0.webp', 'Mapa visual de Identidad Evolutiva'],
    ['reporte-1.webp', 'Quién soy hoy'],
    ['reporte-2.webp', 'En qué eres bueno y cómo funcionas mejor'],
    ['reporte-3.webp', 'Dónde puedes generar más valor'],
    ['reporte-4.webp', 'Mi proyecto de vida']
  ];
  const fan = $('.fan');
  const setActive = idx => {
    if (fan) {
      $$('.fan-card', fan).forEach((card, i) => {
        const slot = i - 2;                       // posiciones fijas: el abanico no se reordena
        const on = i === idx;
        card.style.setProperty('--x', (slot * 34) + '%');
        card.style.setProperty('--y', on ? '-4%' : (Math.abs(slot) * 3) + '%');
        card.style.setProperty('--r', on ? '0deg' : (slot * 6) + 'deg');
        card.style.setProperty('--z', String(on ? 20 : 10 - Math.abs(i - idx)));
        card.classList.toggle('active', on);
      });
    }
    $$('[data-page-pick]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.pagePick) === idx)));
  };
  if (fan) setActive(0);
  $$('[data-page-pick]').forEach(b => {
    b.addEventListener('click', () => setActive(Number(b.dataset.pagePick)));
    b.addEventListener('mouseenter', () => setActive(Number(b.dataset.pagePick)));
  });

  const lb = $('.lightbox');
  let cur = 0, lastFocus = null;
  const show = n => {
    if (!lb) return;
    cur = (n + pages.length) % pages.length;
    const img = $('img', lb);
    img.src = 'assets/' + pages[cur][0];
    img.alt = 'Informe de ejemplo (caso ficticio de Mateo Valdivia): ' + pages[cur][1];
    $('.lb-cap', lb).textContent = (cur + 1) + ' de 5. ' + pages[cur][1] + '. Caso ficticio.';
    if (!lb.classList.contains('open')) {
      lastFocus = document.activeElement;
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
      $('.lb-close', lb).focus();
    }
  };
  const hide = () => {
    if (!lb) return;
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock');
    lastFocus?.focus();
  };
  $$('[data-open-page]').forEach(b => b.addEventListener('click', () => {
    const n = Number(b.dataset.openPage);
    if (b.classList.contains('fan-card') && !b.classList.contains('active') && window.innerWidth > 640) { setActive(n); return; }
    show(n);
  }));
  $('.lb-close')?.addEventListener('click', hide);
  $('.lb-prev')?.addEventListener('click', () => show(cur - 1));
  $('.lb-next')?.addEventListener('click', () => show(cur + 1));
  lb?.addEventListener('click', e => { if (e.target === lb) hide(); });
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  /* ---------- Apariciones únicas (chat y antes/hoy) ---------- */
  const once = (el, fn, threshold = 0.35) => {
    if (!el) return;
    if (!('IntersectionObserver' in window) || reduce) { fn(); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { fn(); io.disconnect(); } }), { threshold });
    io.observe(el);
  };
  $$('.chat-body.pending').forEach(body => {
    const msgs = $$('.msg', body);
    msgs.forEach(m => m.style.transitionDelay = '0s');
    once(body, () => {
      msgs.forEach((m, i) => { m.style.transitionDelay = (i * 0.9) + 's'; });
      body.classList.remove('pending');
    });
  });

  $$('.evo').forEach(evo => {
    const btns = $$('[data-evo]', evo);
    const set = s => { evo.dataset.state = s; btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.evo === s))); };
    btns.forEach(b => b.addEventListener('click', () => set(b.dataset.evo)));
    once(evo, () => setTimeout(() => { if (evo.dataset.state === 'antes') set('hoy'); }, 900), 0.5);
  });

  /* ---------- Experiencias: filtros + carrusel ---------- */
  $$('[data-testis]').forEach(root => {
    const car = $('.carousel', root);
    $$('[data-filter]', root).forEach(b => b.addEventListener('click', () => {
      $$('[data-filter]', root).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const k = b.dataset.filter;
      $$('.testi', root).forEach(t => { t.hidden = !(k === 'todas' || t.dataset.type === k); });
      car.scrollTo({ left: 0, behavior: reduce ? 'auto' : 'smooth' });
    }));
    const step = () => (($('.testi:not([hidden])', root)?.offsetWidth) || 380) + 20;
    $('[data-car-prev]', root)?.addEventListener('click', () => car.scrollBy({ left: -step(), behavior: reduce ? 'auto' : 'smooth' }));
    $('[data-car-next]', root)?.addEventListener('click', () => car.scrollBy({ left: step(), behavior: reduce ? 'auto' : 'smooth' }));
  });

  /* ---------- Formularios: preparan un correo (sin backend) ---------- */
  $$('form[data-mail-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (C.applicationEndpoint) { form.action = C.applicationEndpoint; form.method = 'post'; form.submit(); return; }
    const data = new FormData(form);
    const kind = form.getAttribute('data-mail-form');
    const lines = ['Formulario: ' + kind, ''];
    for (const [k, v] of data.entries()) if (k !== 'acepto' && String(v).trim()) lines.push(k + ': ' + String(v).trim());
    const msg = $('.form-msg', form);
    if (msg) { msg.classList.add('show'); msg.textContent = 'Abrimos tu aplicación de correo con el mensaje listo. Revísalo y envíalo desde allí.'; }
    window.location.href = 'mailto:' + (C.supportEmail || 'talento@teilenteens.com') +
      '?subject=' + encodeURIComponent('Teilen Teens: ' + kind) + '&body=' + encodeURIComponent(lines.join('\n'));
  }));

  /* ---------- Video con carga a pedido ---------- */
  $$('[data-video]').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = b.dataset.video + (b.dataset.video.includes('?') ? '&' : '?') + 'autoplay=1';
    f.title = b.getAttribute('aria-label') || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture';
    f.allowFullscreen = true;
    b.replaceWith(f);
  }));
  /* ---------- Correos protegidos de testimonios (se arman al cargar) ---------- */
  $$('[data-mail-user]').forEach(a => {
    const m = a.dataset.mailUser + '@' + a.dataset.mailDomain;
    a.href = 'mailto:' + m;
    const s = $('span', a); if (s) s.textContent = m;
  });

  /* ---------- Cifra animada de mentores ---------- */
  $$('[data-count-to]').forEach(el => {
    const end = Number(el.dataset.countTo);
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = t => {
        const k = Math.min(1, (t - t0) / 1200);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- Aparición suave de bloques al hacer scroll ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const sel = '.head, .tile, .step, .member, .horizon, .eco-card, .world, .voice, .duo-card, .ely, .bv-card, .t-stats, .evo-card, .prompt, .bubble, .article, .stat-card, .social, .persp, .bigquote';
    const vh = window.innerHeight;
    const items = $$(sel).filter(el => el.getBoundingClientRect().top > vh * 0.92);
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      el.classList.add('in');
      setTimeout(() => { el.classList.remove('rv', 'in'); el.style.transitionDelay = ''; }, 1100);
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => {
      const sib = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.matches(sel)) : [];
      const i = Math.max(0, sib.indexOf(el));
      el.style.transitionDelay = Math.min(i, 5) * 0.08 + 's';
      el.classList.add('rv');
      io.observe(el);
    });
  }
})();
