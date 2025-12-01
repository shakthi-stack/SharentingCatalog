// Toggle A0–A3 sections on each card page
function initAssent() {
  const groups = document.querySelectorAll('[data-assent-group]');
  groups.forEach(group => {
    const radios = group.querySelectorAll('input[type=radio][name=assent]');
    const update = () => {
      const val = group.querySelector('input[name=assent]:checked')?.value || 'A0';
      group.querySelectorAll('[data-assent]').forEach(el => {
        el.style.display = (el.getAttribute('data-assent') === val) ? '' : 'none';
      });
    };
    radios.forEach(r => r.addEventListener('change', update));
    update();
  });
}
document.addEventListener('DOMContentLoaded', initAssent);

// ------- Block (i) definitions: scoped to the nearest .box -------
(function initInfoBlocks(){
  const DEFINITIONS = {
    status:   { title: "Status only", body: "We don’t auto-change this control. It stays at your current default for this post/account. You can still adjust it manually." },
    friends:  { title: "Close Friends / Private", body: "Limits visibility to a small, chosen audience (e.g., Close Friends) or only you. Use when assent is unsure or risks are high." },
    narrowed: { title: "Narrowed audience", body: "Use a smaller audience than Public (e.g., Friends or a custom list) to reduce reach and copying." },
    off:      { title: "Off", body: "Disables this feature for the post (e.g., Remix, Downloads, Location). Note: viewers could still screen-record; keep sensitive details out." },
    thumbnail:{ title: "Non-identifying thumbnail", body: "Choose a cover image that avoids faces, names, school logos, house numbers, or distinctive locations." },
    identifiers: {
    title: "Identifiers",
    body: "Names, date of birth, medical record numbers, diagnosis codes, lab results, hospital/clinic names, appointment dates/times, distinctive uniforms/signage—anything that links the post to the child’s identity or health details."
  },
  thumbnailphi: {
    title: "Non-identifying thumbnail (PHI)",
    body: "Pick a cover image that avoids documents, lab screenshots, wristbands, clinic signage, or faces. Prefer neutral objects (e.g., support ribbons) or text-only slides without names/dates."
  },
    bystanders: {
    title: "Bystanders",
    body: "People in the background (e.g., other patients, parents, staff). If you don’t have their consent/assent, blur or crop them out."
  },
  comments: {
    title: "Comments: Limited/Off",
    body: "Limits or disables public replies to reduce debate/speculation about a child’s condition. Prefer Limited/Off in clinical contexts."
  },
    sponsor: {
    title: "Sponsored content",
    body: "Posts made to promote a product or cause (brand deals, affiliate links, crowdfunding). Sponsorship never overrides a child’s assent or best interests—apply the same (or stricter) privacy controls."
  },
  checkin: {
    title: "Check-in later",
    body: "Delay publishing and re-ask for assent after 24–48 hours. Time and distance can help children reconsider, especially if they were tired, upset, or pressured."
  },
    timeshift: {
    title: "Time-shift posting",
    body: "Post after you’ve left a place (or schedule for later). Avoid live posting that reveals your current location or routine."
  },
  trail: {
    title: "Location trail",
    body: "Repeated posts from the same places/times can reveal school routes, therapy schedules, or daily routines—even without GPS tags."
  }


  };

  function renderPanel(host, {title, body}) {
    host.innerHTML = `
      <div class="info-panel" role="region" aria-live="polite">
        <p class="info-title">${title}</p>
        <p class="info-body">${body}</p>
        <span class="info-close" role="button" tabindex="0">Close</span>
      </div>`;
    const closer = host.querySelector('.info-close');
    const close = () => (host.innerHTML = '');
    closer.addEventListener('click', close);
    closer.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') close(); });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.info[data-def]');
    if (!btn) return;

    const key = btn.getAttribute('data-def');
    const def = DEFINITIONS[key];
    if (!def) return;

    // LIMIT SCOPE to the nearest .box so A1/A2/A3 + TikTok/Instagram don't leak
    const box = btn.closest('.box');
    if (!box) return;

    // Use/create a host INSIDE this box
    let host = box.querySelector('.info-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'info-host';
      box.appendChild(host);
    }

    // Toggle only buttons inside the same box
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    box.querySelectorAll('.info[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));

    if (expanded) {
      host.innerHTML = '';
      btn.setAttribute('aria-expanded','false');
    } else {
      renderPanel(host, def);
      btn.setAttribute('aria-expanded','true');
    }
  });
})();

// When Assent toggles, close any open info panels in hidden boxes
(function bindAssentInfoReset(){
  document.querySelectorAll('[data-assent-group] input[name=assent]').forEach(radio => {
    radio.addEventListener('change', () => {
      // Reset all info panels/buttons
      document.querySelectorAll('.info-host').forEach(h => h.innerHTML = '');
      document.querySelectorAll('.info[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded','false'));
    });
  });
})();
