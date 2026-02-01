// Lightweight on-page helper (no external services, no API keys).
// Purpose: help visitors find answers fast; unknown questions route to Instagram contact.
// Notes: This is NOT part of the €2,500 delivery; it's just a landing helper.

(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  const root = $('#chatWidget');
  if (!root) return;

  const btn = $('#chatFab');
  const panel = $('#chatPanel');
  const closeBtn = $('#chatClose');
  const form = $('#chatForm');
  const input = $('#chatInput');
  const log = $('#chatLog');
  const sendToIg = $('#chatSendToIg');

  const igUrl = 'https://www.instagram.com/ninakopaeva777';

  // Simple KB: keyword → answer keys.
  // Keep answers short and non-technical.
  const KB = [
    {
      match: [/price|cost|€|2500|pricing|tarif/i],
      a: {
        en: 'Setup is €2,500. Typical MVP delivery: 7–14 days. Monthly running costs depend on message volume.',
        fr: 'La mise en place est à 2 500 €. Délai typique : 7–14 jours. Les coûts mensuels dépendent du volume de messages.',
        ru: 'Настройка — €2,500. Срок запуска обычно 7–14 дней. Ежемесячные расходы зависят от объёма сообщений.'
      }
    },
    {
      match: [/how long|timeline|days|delivery|7|14/i],
      a: {
        en: 'Typical delivery is 7–14 days after we have WhatsApp + Stripe + Notion access.',
        fr: 'Le délai typique est de 7–14 jours après accès à WhatsApp, Stripe et Notion.',
        ru: 'Обычно 7–14 дней после того, как есть доступ к WhatsApp, Stripe и Notion.'
      }
    },
    {
      match: [/whatsapp|number|phone/i],
      a: {
        en: 'We connect to one WhatsApp business number and the agent replies there.',
        fr: 'Nous connectons un numéro WhatsApp business, et l’agent répond dans ce chat.',
        ru: 'Подключаем один бизнес‑номер WhatsApp — агент отвечает в этом чате.'
      }
    },
    {
      match: [/notion|lead/i],
      a: {
        en: 'Each conversation is saved to Notion as a lead: contact, answers, notes, and status (new/qualified/paid).',
        fr: 'Chaque conversation est enregistrée dans Notion : contact, réponses, notes et statut (new/qualified/paid).',
        ru: 'Каждая переписка сохраняется в Notion как лид: контакт, ответы, заметки и статус (new/qualified/paid).' 
      }
    },
    {
      match: [/stripe|pay|payment|checkout/i],
      a: {
        en: 'When the client is ready, the agent sends a simple Stripe payment link.',
        fr: 'Quand le client est prêt, l’agent envoie un lien de paiement Stripe.',
        ru: 'Когда клиент готов — агент отправляет простую ссылку на оплату Stripe.'
      }
    },
    {
      match: [/language|english|french|français|francais/i],
      a: {
        en: 'The agent supports English and French and can switch automatically.',
        fr: 'L’agent parle anglais et français et peut basculer automatiquement.',
        ru: 'Агент поддерживает английский и французский и может переключаться автоматически.'
      }
    },
    {
      match: [/medical|diagnosis|health|treat/i],
      a: {
        en: 'The agent does not provide medical diagnosis. It collects information and helps with logistics and payment.',
        fr: 'L’agent ne fait pas de diagnostic médical. Il collecte des infos et aide pour la logistique et le paiement.',
        ru: 'Агент не ставит диагнозы. Он собирает информацию и помогает с организацией и оплатой.'
      }
    }
  ];

  function getLang(){
    const lang = (localStorage.getItem('lang') || document.documentElement.getAttribute('lang') || 'en').slice(0,2);
    return ['en','fr','ru'].includes(lang) ? lang : 'en';
  }

  function t(key){
    const dict = window.DICT && window.DICT[getLang()];
    return (dict && dict[key]) || (window.DICT && window.DICT.en && window.DICT.en[key]) || key;
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

  function answer(q){
    const lang = getLang();
    for (const item of KB) {
      if (item.match.some(rx => rx.test(q))) return item.a[lang] || item.a.en;
    }
    return t('chat_fallback');
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (input.value || '').trim();
    if (!q) return;
    addMsg('user', q);
    input.value = '';
    // simulate small thinking delay
    setTimeout(() => addMsg('bot', answer(q)), 180);
  });

  sendToIg.addEventListener('click', () => {
    window.open(igUrl, '_blank', 'noopener,noreferrer');
  });
})();
