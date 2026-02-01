// Lightweight on-page helper (no external services, no API keys).
// Purpose: help visitors find answers fast; unknown questions route to Instagram contact.
// Notes: This is NOT part of the €2,500 delivery; it's just a landing helper.

(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const btn = $('#chatFab');
  const panel = $('#chatPanel');
  if (!btn || !panel) return;
  const closeBtn = $('#chatClose');
  const form = $('#chatForm');
  const input = $('#chatInput');
  const log = $('#chatLog');
  const sendToIg = $('#chatSendToIg');

  const igUrl = 'https://www.instagram.com/ninakopaeva777';

  // NOTE: Real AI responses are generated server-side (Reelixy CRM).
  // No API keys are stored on the landing.

  function getLang(){
    const lang = (localStorage.getItem('lang') || document.documentElement.getAttribute('lang') || 'en').slice(0,2);
    return ['en','fr','ru'].includes(lang) ? lang : 'en';
  }

  function t(key){
    // DICT lives in index.html as const DICT
    // but we also support window.DICT if present
    const any = (typeof DICT !== 'undefined' ? DICT : (window.DICT || null));
    const dict = any && any[getLang()];
    return (dict && dict[key]) || (any && any.en && any.en[key]) || key;
  }

  const visitorIdKey = 'agentLandingVisitorId';
  function getVisitorId(){
    let id = localStorage.getItem(visitorIdKey);
    if (!id) {
      id = 'v_' + Math.random().toString(36).slice(2) + '_' + Date.now().toString(36);
      localStorage.setItem(visitorIdKey, id);
    }
    return id;
  }

  // legacy helper logger (kept for compatibility; not used in real AI mode)
  async function sendToCRM(payload){
    try {
      const url = 'https://crm.reelixy.com/api/public/agent-landing/message';
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (_) {}
  }

  function addMsg(role, text){
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  async function answerViaCRM(q){
    const url = 'https://crm.reelixy.com/api/public/agent-landing/send';
    const payload = {
      visitorId: getVisitorId(),
      message: q,
      language: getLang(),
      pageUrl: window.location.href,
      source: 'agent-landing'
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.success) {
      throw new Error(j.error || 'Request failed');
    }

    return j.data && j.data.reply ? j.data.reply : t('chat_fallback');
  }

  function open(){
    panel.classList.add('open');
    btn.classList.add('open');
    input.focus();
  }
  function close(){
    panel.classList.remove('open');
    btn.classList.remove('open');
  }

  btn.addEventListener('click', () => {
    if (panel.classList.contains('open')) close(); else open();
  });
  closeBtn.addEventListener('click', close);

  // Initial greeting
  addMsg('bot', t('chat_greeting'));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const q = (input.value || '').trim();
    if (!q) return;

    addMsg('user', q);
    input.value = '';

    // lightweight typing indicator
    const typingId = 'typing_' + Date.now();
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg bot';
    typingEl.id = typingId;
    typingEl.innerHTML = '<div class="chat-bubble">…</div>';
    log.appendChild(typingEl);
    log.scrollTop = log.scrollHeight;

    try {
      const reply = await answerViaCRM(q);
      typingEl.remove();
      addMsg('bot', reply);
    } catch (err) {
      typingEl.remove();
      addMsg('bot', t('chat_fallback'));
    }
  });

  sendToIg.addEventListener('click', () => {
    window.open(igUrl, '_blank', 'noopener,noreferrer');
  });
})();
