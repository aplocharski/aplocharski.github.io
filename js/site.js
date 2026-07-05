/* ------------------------------------------------------------------
   Aleksander Plocharski — personal site
   All content is rendered from content.json; nothing is hardcoded here
   except structural UI chrome (tab names, list group headers).
   ------------------------------------------------------------------ */
(() => {
  'use strict';

  const TABS = [
    { id: 'publications', label: 'publications' },
    { id: 'reviewing', label: 'reviewing' },
    { id: 'talks', label: 'talks' },
  ];
  const LINK_LABELS = { google_scholar: 'scholar', github: 'github', linkedin: 'linkedin', orcid: 'orcid' };
  const COUNTRY_CODES = {
    'united states': 'us', 'united kingdom': 'uk', 'germany': 'de', 'china': 'cn',
    'taiwan': 'tw', 'poland': 'pl', 'japan': 'jp', 'canada': 'ca', 'israel': 'il',
    'france': 'fr', 'italy': 'it', 'spain': 'es', 'netherlands': 'nl', 'austria': 'at',
    'switzerland': 'ch', 'south korea': 'kr', 'australia': 'au',
  };
  let DATA = null;
  const state = { section: 'research', tab: 'publications' };

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
  const escReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pad2 = (n) => String(n).padStart(2, '0');
  const fmtDate = (d) => String(d).split('-').reverse().join('.'); // "2026-05" -> "05.2026"

  const subline = (title) => title.toLowerCase().replace(' in ', ' · ');

  function typeLabel(pub) {
    return pub.type === 'poster' ? 'poster' : (pub.venue_type || '');
  }
  function statusLabel(status) {
    const t = String(status).toLowerCase();
    if (t.includes('in press')) return 'in press';
    const m = String(status).match(/\((\d{2}\.\d{4})\)/);
    if (m) return 'to appear ' + m[1];
    if (t.startsWith('published')) return 'published';
    return t;
  }
  function locShort(loc) {
    const parts = String(loc).split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) return String(loc).toLowerCase();
    const country = parts.pop().toLowerCase();
    return (parts.join(', ') + ', ' + (COUNTRY_CODES[country] || country)).toLowerCase();
  }
  function authorsHtml(authors, highlight) {
    return (authors || []).map((a) => {
      const safe = esc(a);
      return highlight
        ? safe.replace(new RegExp('(' + escReg(esc(highlight)) + ')'), '<b>$1</b>')
        : safe;
    }).join(', ');
  }
  function photoHtml(cls) {
    const p = DATA.profile;
    return p.photo
      ? `<img class="${cls}" src="${esc(p.photo)}" alt="${esc(p.name)}">`
      : `<div class="${cls} ph"></div>`;
  }
  function linkRow(cls, label, url) {
    const inner = `<span>${esc(label)}</span><span class="arr">↗</span>`;
    return url
      ? `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${inner}</a>`
      : `<span class="${cls}">${inner}</span>`;
  }
  function emailRows() {
    const emails = (DATA.profile.emails || []).filter(Boolean);
    if (!emails.length) return '<div class="mail"><span class="mail-label">mail</span>‹tbd›</div>';
    return emails.map((e) => {
      const addr = typeof e === 'string' ? e : e.address;
      const label = typeof e === 'string' ? 'mail' : (e.label || 'mail');
      return `<div class="mail"><span class="mail-label">${esc(label)}</span>` +
        `<a href="mailto:${esc(addr)}">${esc(addr)}</a></div>`;
    }).join('');
  }

  /* ---------- identity (rail + mobile hero + top bar) ---------- */
  function railHtml() {
    const p = DATA.profile;
    const mailRows = emailRows();
    const nav = DATA.nav.map((n, i) => {
      const active = n.id === state.section;
      return `<a class="rail-nav${active ? ' active' : ''}" href="#/${esc(n.id)}"${active ? ' aria-current="page"' : ''}>` +
        `<span class="num">${pad2(i + 1)}</span><span>${esc(n.label)}</span>` +
        `${active ? '<span class="marker">◂</span>' : ''}</a>`;
    }).join('');
    const links = Object.entries(LINK_LABELS)
      .map(([key, label]) => linkRow('link-row', label, p.links && p.links[key])).join('');
    return `
      ${photoHtml('rail-photo')}
      <h1>${esc(p.name)}</h1>
      <div class="sub">${esc(subline(p.title))}</div>
      <p class="affil">${esc(p.affiliations[0] || '')}</p>
      <p class="bio">${esc(p.bio_draft)}</p>
      <div class="rail-label"><span>Contact</span><span class="line"></span></div>
      ${mailRows}
      <div class="rail-label"><span>Sections</span><span class="line"></span></div>
      <nav class="rail-nav-list" aria-label="Sections">${nav}</nav>
      <div class="rail-label"><span>Links</span><span class="line"></span></div>
      <div class="rail-links">${links}</div>
      <div class="loc">${esc(p.location).toLowerCase()}</div>`;
  }

  function topbarHtml() {
    const p = DATA.profile;
    const idx = DATA.nav.findIndex((n) => n.id === state.section);
    const nav = DATA.nav[idx];
    const words = p.name.split(' ');
    const abbr = words.length > 1 ? words[0][0] + '. ' + words.slice(1).join(' ') : p.name;
    return `<span class="tb-name">${esc(abbr)}</span>` +
      `<span class="tb-sec">${pad2(idx + 1)} / ${esc(nav.label_mobile || nav.label)}</span>`;
  }

  function mobileHeroHtml() {
    const p = DATA.profile;
    const links = Object.entries(LINK_LABELS)
      .map(([key, label]) => linkRow('chip-link', label, p.links && p.links[key])).join('');
    return `
      <div class="hero-top">
        ${photoHtml('hero-photo')}
        <div class="hero-id">
          <h1>${esc(p.name)}</h1>
          <div class="sub">${esc(subline(p.title))}</div>
          <p class="affil">${esc(p.affiliations[0] || '')}</p>
        </div>
      </div>
      <p class="bio">${esc(p.bio_draft)}</p>
      <div class="hero-contact">${emailRows()}</div>
      <div class="hero-links">${links}</div>`;
  }

  function mobileNavHtml() {
    return DATA.nav.map((n, i) => {
      const active = n.id === state.section;
      return `<a class="chip${active ? ' active' : ''}" href="#/${esc(n.id)}"${active ? ' aria-current="page"' : ''}>` +
        `<span class="num">${pad2(i + 1)}</span>${esc(n.label_mobile || n.label)}</a>`;
    }).join('');
  }

  /* ---------- research: publications ---------- */
  function pubMetaHtml(pub) {
    const parts = [`<span class="venue">${esc(pub.venue)}</span>`];
    const type = typeLabel(pub);
    if (type) {
      const opt = type === 'journal' || type === 'conference' ? ' opt' : '';
      parts.push(`<span class="m${opt}"> · ${esc(type)}</span>`);
    }
    if (pub.year && !String(pub.venue).includes(String(pub.year))) {
      parts.push(`<span class="m opt"> · ${esc(pub.year)}</span>`);
    }
    if (pub.award) {
      parts.push(` · <span class="award">✳ ${esc(pub.award_short || pub.award)}</span>`);
    }
    return parts.join('');
  }

  function publicationsHtml() {
    const items = (DATA.publications || []).map((pub) => {
      const thumb = pub.thumbnail
        ? `<img class="pub-thumb" src="${esc(pub.thumbnail)}" alt="">`
        : '<div class="pub-thumb"><span>teaser</span></div>';
      return `<article class="pub">
        ${thumb}
        <div>
          <h3>${esc(pub.title)}</h3>
          <p class="authors">${authorsHtml(pub.authors, DATA._meta.highlight_author)}</p>
          <div class="pub-meta">${pubMetaHtml(pub)}</div>
        </div>
      </article>`;
    }).join('');
    return `<div class="list">${items}</div>`;
  }

  /* ---------- research: reviewing & service ---------- */
  function reviewingHtml() {
    const committees = (DATA.committees || []).map((c) => {
      const title = c.title_short || c.role;
      const track = c.track ? ` <span class="m">· ${esc(c.track)} track</span>` : '';
      return `<div class="svc-row"><span class="svc-title">${esc(title)}${track}</span>` +
        `<span class="svc-loc">${esc(locShort(c.location))}</span></div>`;
    }).join('');
    const reviews = (DATA.reviewing || []).map((r) => {
      const track = r.track ? ` <span class="m">· ${esc(r.track)}</span>` : '';
      return `<div class="svc-row"><span class="svc-title">${esc(r.venue)}${track}</span>` +
        `<span class="svc-loc">${esc(locShort(r.location))}</span></div>`;
    }).join('');
    return `<div class="list">
      ${committees ? `<div class="group-label">committee member</div>${committees}` : ''}
      ${reviews ? `<div class="group-label">reviewer</div>${reviews}` : ''}
    </div>`;
  }

  /* ---------- research: talks ---------- */
  function talkRow(talk) {
    const tag = talk.upcoming
      ? '<span class="tag acc">upcoming</span>'
      : (talk.type && talk.type !== 'paper'
        ? `<span class="tag">${esc(talk.type.replace(/-/g, ' '))}</span>`
        : '<span class="tag"></span>');
    return `<div class="talk">
      <span class="talk-date">${esc(fmtDate(talk.date))}</span>
      <div class="talk-body">
        <div class="talk-title">${esc(talk.title)}</div>
        <div class="talk-venue"><span class="venue">${esc(talk.event)}</span> · ${esc(talk.location)}</div>
      </div>
      ${tag}
    </div>`;
  }

  function talksHtml() {
    const conf = (DATA.talks && DATA.talks.conference_presentations) || [];
    const other = (DATA.talks && DATA.talks.other_talks) || [];
    return `<div class="list talks">
      <div class="group-label">conference presentations</div>
      ${conf.map(talkRow).join('')}
      ${other.length ? `<div class="group-label">invited · seminars · panels</div>${other.map(talkRow).join('')}` : ''}
    </div>`;
  }

  /* ---------- teaching ---------- */
  function termYear(term) {
    const m = String(term).match(/\d{4}/);
    return m ? +m[0] : 0;
  }
  // Merge courses_taught / courses_coordinated / courses_created into the
  // flat course list the design shows, keyed by course name.
  function mergedCourses(t) {
    const map = new Map();
    const entry = (name) => {
      if (!map.has(name)) map.set(name, { name, terms: new Set() });
      return map.get(name);
    };
    (t.courses_taught || []).forEach((c) => {
      const e = entry(c.course);
      e.taught = c;
      (c.terms || []).forEach((x) => e.terms.add(x));
    });
    (t.courses_coordinated || []).forEach((c) => {
      const e = entry(c.course);
      e.coordinated = true;
      if (c.term) e.terms.add(c.term);
    });
    (t.courses_created || []).forEach((c) => { entry(c.course).created = c; });
    const list = [...map.values()];
    list.forEach((e) => {
      const years = [...e.terms].map(termYear).filter(Boolean);
      e.start = years.length ? Math.min(...years) : 0;
      e.end = years.length ? Math.max(...years) : 0;
      e.count = e.terms.size;
    });
    list.sort((a, b) => b.end - a.end || b.start - a.start || a.name.localeCompare(b.name));
    return list;
  }
  function courseTerms(c) {
    if (!c.count) return '';
    const span = c.start === c.end ? String(c.start) : `${c.start}–${c.end}`;
    return `${c.count} ${c.count === 1 ? 'term' : 'terms'} · ${span}`;
  }
  function courseRole(c) {
    const parts = [];
    if (c.taught) {
      const m = String(c.taught.role).toLowerCase().match(/^([^(]+?)\s*\(([^)]+)\)\s*$/);
      parts.push(m ? `${m[1].trim()} · ${m[2].replace(/\s*\/\s*/g, ' & ').trim()}` : String(c.taught.role).toLowerCase());
    } else if (c.coordinated) {
      parts.push('coordinator');
    }
    if (c.created && c.created.level) parts.push(c.created.level);
    return parts.join(' · ');
  }
  const initials = (name) => {
    const words = String(name).trim().split(/\s+/);
    return words.length > 1
      ? words.slice(0, -1).map((w) => w[0] + '.').join(' ') + ' ' + words[words.length - 1]
      : name;
  };

  function teachingHtml(title) {
    const t = DATA.teaching || {};
    const courses = mergedCourses(t).map((c) => {
      const tags = [c.created && 'created', c.coordinated && 'coordinator'].filter(Boolean)
        .map((tag) => `<span class="course-tag">${tag}</span>`).join('');
      const terms = courseTerms(c);
      const role = courseRole(c);
      return `<div class="course">
        <div class="course-name-row"><span class="course-name">${esc(c.name)}</span>${tags}</div>
        ${terms ? `<span class="course-terms">${esc(terms)}</span>` : ''}
        ${role ? `<div class="course-role">${terms ? `<span class="terms-inline">${esc(terms)} · </span>` : ''}${esc(role)}</div>` : ''}
        ${c.created && c.created.description ? `<p class="course-desc">${esc(c.created.description)}</p>` : ''}
      </div>`;
    }).join('');
    const theses = (t.supervised_theses || []).map((th) => `<div class="thesis">
        <span class="thesis-date">${esc(fmtDate(th.date))}</span>
        <div class="thesis-body">
          <div class="thesis-title">${esc(th.title)}</div>
          <div class="thesis-students">${esc((th.students || []).map(initials).join(' · '))}</div>
        </div>
        <span class="tag">${esc(th.level_short || th.level)}</span>
      </div>`).join('');
    return `
      <h2 class="page-title">${esc(title)}</h2>
      <div class="rule"></div>
      ${t.intro ? `<p class="intro">${esc(t.intro)}</p>` : ''}
      <div class="section-label">Courses</div>
      <div class="section-rule"></div>
      <div class="courses">${courses}</div>
      ${theses ? `<div class="section-label gap-lg">Supervised theses</div>
      <div class="section-rule"></div>
      <div class="list">${theses}</div>` : ''}`;
  }

  /* ---------- sections ---------- */
  function panelHtml() {
    if (state.tab === 'reviewing') return reviewingHtml();
    if (state.tab === 'talks') return talksHtml();
    return publicationsHtml();
  }

  function researchHtml(title) {
    const cells = (DATA.highlights || []).map((h) =>
      `<div class="hl-cell"><div class="hl-key">${esc(h.label)}</div><p>${esc(h.text)}</p></div>`
    ).join('');
    const tabs = TABS.map((t) =>
      `<button class="tab${state.tab === t.id ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`
    ).join('');
    return `
      <h2 class="page-title">${esc(title)}</h2>
      <div class="rule"></div>
      <section class="highlights"><div class="hl-head">✳ Highlights</div><div class="hl-grid">${cells}</div></section>
      <div class="tabbar">${tabs}</div>
      <div class="panel">${panelHtml()}</div>`;
  }

  function wipHtml(sectionId, title) {
    const wip = DATA.wip || {};
    const note = (wip.notes || {})[sectionId] || '';
    return `
      <h2 class="page-title">${esc(title)}</h2>
      <div class="rule"></div>
      <div class="wip">
        <div class="wip-label">${esc(wip.label || '// work in progress')}</div>
        <div class="wip-head">${esc(wip.heading || '')}</div>
        <p>${esc(note)}</p>
      </div>`;
  }

  /* ---------- routing + render ---------- */
  function parseHash() {
    const [section, tab] = location.hash.replace(/^#\/?/, '').split('/');
    state.section = DATA.nav.some((n) => n.id === section) ? section : 'research';
    state.tab = TABS.some((t) => t.id === tab) ? tab : 'publications';
  }

  function render() {
    document.title = DATA.profile.name;
    document.getElementById('topbar').innerHTML = topbarHtml();
    document.getElementById('rail').innerHTML = railHtml();
    document.getElementById('mobileHero').innerHTML = mobileHeroHtml();
    document.getElementById('mobileNav').innerHTML = mobileNavHtml();
    const nav = DATA.nav.find((n) => n.id === state.section);
    const title = nav.title || nav.label;
    let html;
    if (state.section === 'research') html = researchHtml(title);
    else if (state.section === 'teaching') html = teachingHtml(title);
    else html = wipHtml(state.section, title);
    document.getElementById('main').innerHTML = html;
  }

  document.addEventListener('click', (e) => {
    const tab = e.target.closest('[data-tab]');
    if (tab) location.hash = '#/research/' + tab.dataset.tab;
  });

  window.addEventListener('hashchange', () => {
    const prev = state.section;
    parseHash();
    render();
    if (prev !== state.section) window.scrollTo(0, 0);
  });

  fetch('content.json')
    .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then((data) => { DATA = data; parseHash(); render(); })
    .catch((err) => {
      document.getElementById('main').innerHTML =
        '<p class="load-err">Failed to load content.json (' + esc(err.message) +
        '). If you opened index.html directly from disk, serve it over HTTP instead — e.g. <code>python -m http.server</code> — or use GitHub Pages.</p>';
    });
})();
