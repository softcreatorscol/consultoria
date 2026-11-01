// Cumplimiento & Consultoría S.A.S. — scripts compartidos por todas las páginas
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Página activa en el menú
  const page = document.body.dataset.page;
  $$('nav [data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === page));

  // Año del footer
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Header: sólido al bajar, se oculta al hacer scroll hacia abajo + barra de progreso
  const header = $('#header'), bar = $('#progress');
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    header.classList.toggle('solid', y > 60);
    header.classList.toggle('hide', y > 500 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (max > 0 ? y / max * 100 : 0) + '%';
    manifestoFill();
  }
  addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  $('#burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));
  $$('nav a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));

  // Brillo que sigue el cursor en la portada
  const glow = $('#glow'), hero = $('.hero');
  if (glow && hero) hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - r.left) + 'px';
    glow.style.top = (e.clientY - r.top) + 'px';
  });

  // Texto que se enciende palabra por palabra al hacer scroll
  const man = $('#manifesto');
  let words = [];
  if (man) {
    man.innerHTML = man.textContent.replace(/\[([^\]]+)\]|(\S+)/g, (m, hl, w) =>
      hl ? hl.split(' ').map(x => '<span class="w hl">' + x + '</span>').join(' ') : '<span class="w">' + w + '</span>');
    words = $$('.w', man);
  }
  function manifestoFill() {
    if (!man) return;
    const r = man.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }

  // Acordeón de servicios
  const panels = $$('.panel');
  const openPanel = i => panels.forEach((p, j) => p.classList.toggle('open', i === j));
  panels.forEach((p, i) => {
    p.addEventListener('mouseenter', () => matchMedia('(min-width:1081px)').matches && openPanel(i));
    p.addEventListener('click', () => openPanel(i));
  });

  // Testimonios
  const cls = $$('.client'), qs = $$('.quote blockquote');
  if (cls.length) {
    let ti = 0, timer;
    const showT = i => { ti = i; cls.forEach((c, j) => c.classList.toggle('on', j === i)); qs.forEach((q, j) => q.classList.toggle('on', j === i)); };
    const auto = () => { clearInterval(timer); timer = setInterval(() => showT((ti + 1) % qs.length), 6000); };
    cls.forEach((c, i) => c.addEventListener('click', () => { showT(i); auto(); }));
    auto();
  }

  // Video SARLAFT: pegue aquí el ID de YouTube (lo que va después de "v=")
  const VIDEO_ID = "";
  const video = $('#video');
  if (video && VIDEO_ID) video.innerHTML = '<iframe src="https://www.youtube.com/embed/' + VIDEO_ID + '" title="¿Qué es el SARLAFT?" allowfullscreen loading="lazy"></iframe>';

  // Animaciones de entrada
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$('.rv, #steps').forEach(el => io.observe(el));

  // Formulario: abre el correo con los datos (puede cambiarlo por Formspree o Netlify Forms)
  const form = $('#form');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => $('#' + id).value;
    const body = `Nombre: ${v('nombre')}\nEmpresa: ${v('empresa')}\nCorreo: ${v('correo')}\nTeléfono: ${v('tel')}\nServicio: ${v('servicio')}\n\n${v('mensaje')}`;
    location.href = 'mailto:contacto@cumplimientoyconsultoria.com?subject=' +
      encodeURIComponent('Solicitud de asesoría - ' + v('empresa')) + '&body=' + encodeURIComponent(body);
  });

  onScroll();
})();
