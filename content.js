// IG DM Links: liest die Button-Daten (cta_buttons), die Instagram Web bereits
// empfängt, aber nicht darstellt, und zeigt sie als klickbare Links unter der
// Nachricht an. Sendet nichts, speichert nichts, führt keine Aktionen aus.
(() => {
  const linksByTitle = new Map(); // normalisierter Nachrichtentext -> [{title, url}]
  const norm = (s) => s.replace(/\s+/g, ' ').trim();

  // Durchsucht eine GraphQL-Antwort nach Objekten mit cta_buttons
  // (z. B. data...slide_messages.edges[].node.content.xma.cta_buttons).
  function collect(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(collect);
    if (Array.isArray(node.cta_buttons)) {
      const text = node.title_text || node.xmaTitle;
      const links = node.cta_buttons
        .filter((b) => b && /^https?:\/\//.test(b.action_url || ''))
        .map((b) => ({ title: b.title || b.action_url, url: b.action_url }));
      if (text && links.length) linksByTitle.set(norm(text), links);
    }
    for (const key in node) collect(node[key]);
  }

  function handle(text) {
    if (typeof text !== 'string' || !text.includes('cta_buttons')) return;
    for (const line of text.split('\n')) {
      try { collect(JSON.parse(line)); } catch { /* keine JSON-Zeile */ }
    }
    schedule();
  }

  // Antworten von /api/graphql mitlesen (XHR und fetch), ohne sie zu verändern.
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', () => {
      try {
        if (this.responseURL.includes('graphql') && (this.responseType === '' || this.responseType === 'text')) {
          handle(this.responseText);
        }
      } catch { /* ignorieren */ }
    });
    return send.apply(this, args);
  };
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await origFetch.apply(this, args);
    try {
      if (res.url.includes('graphql')) res.clone().text().then(handle, () => {});
    } catch { /* ignorieren */ }
    return res;
  };

  // Links unter die passende Nachrichtenblase setzen.
  function render() {
    if (!linksByTitle.size) return;
    for (const span of document.querySelectorAll('span[dir="auto"]')) {
      const links = linksByTitle.get(norm(span.textContent));
      if (!links) continue;
      const bubble = span.closest('[role="article"]') || span.parentElement;
      if (bubble.querySelector('.igdl-links')) continue;
      const box = document.createElement('div');
      box.className = 'igdl-links';
      box.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:6px;max-width:280px';
      for (const l of links) {
        const a = document.createElement('a');
        a.href = l.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.title = l.url;
        a.textContent = l.title;
        a.style.cssText = 'display:block;padding:8px 12px;border-radius:10px;background:#3797f0;color:#fff;font-weight:600;text-align:center;text-decoration:none';
        box.append(a);
      }
      bubble.append(box);
    }
  }

  let timer = null;
  function schedule() {
    if (!timer) timer = setTimeout(() => { timer = null; render(); }, 300);
  }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();
