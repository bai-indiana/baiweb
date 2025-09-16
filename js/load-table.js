/* ---------- Single video modal (created once, reused) ---------- */
let __videoModal = null;
let __isVideoModalOpen = false;   // guard to prevent instant reopen on hover

function getVideoModal() {
  if (__videoModal) return __videoModal;

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'video-modal-overlay';
  overlay.className = 'video-modal-overlay'; // styled in load-table.css

  // Modal
  const modal = document.createElement('div');
  modal.className = 'video-modal';

  // Video (UNMUTED by default)
  const video = document.createElement('video');
  video.preload = 'metadata';
  video.setAttribute('autoplay', '');
  video.setAttribute('playsinline', '');  // iOS inline
  video.setAttribute('controls', '');
  video.muted = false;                    // ensure unmuted
  video.volume = 1.0;

  modal.appendChild(video);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const tryPlayWithFallback = () => {
    // Try to play; if blocked (autoplay policy), require one user click
    return video.play().catch(() => {
      const once = () => {
        video.play().finally(() => {
          overlay.removeEventListener('click', once);
        });
      };
      overlay.addEventListener('click', once, { once: true });
    });
  };

  const show = (src) => {
    __isVideoModalOpen = true;
    video.src = src;               // set/replace source
    video.muted = false;           // keep unmuted
    overlay.classList.add('show');
    try { video.currentTime = 0; } catch (e) {}
    tryPlayWithFallback();
    // optional: lock scroll while open
    document.documentElement.style.overflow = 'hidden';
  };

  const hide = () => {
    try { video.pause(); } catch(e) {}
    // fully stop on iOS/Safari so it doesn’t “ghost play”
    video.removeAttribute('src');
    video.load();
    overlay.classList.remove('show');
    __isVideoModalOpen = false;
    document.documentElement.style.overflow = '';
  };

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) hide();
  });

  // Close on Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) hide();
  });

  __videoModal = { overlay, modal, video, show, hide };
  return __videoModal;
}

/* ---------- Helpers ---------- */
function resolveVideoSrc(file, tableEl) {
  const base = tableEl?.dataset?.videoBase || '';
  if (/^https?:\/\//i.test(file) || file.startsWith('/') || file.startsWith('./') || file.startsWith('../')) {
    return file;
  }
  return base ? base.replace(/\/?$/, '/') + file : file;
}

/* ---------- Main function (with video token support) ---------- */
function loadTableFromCSV(tableId, csvFileName, firstColIsIcon = false) {
  return fetch(`${csvFileName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`File not found: ${csvFileName}`);
      }
      return response.text();
    })
    .then(data => {
      const table = document.querySelector(`#${tableId}`);
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      thead.innerHTML = '';
      tbody.innerHTML = '';

      const lines = data.trim().split('\n');
      if (lines.length < 2) return;

      // Header
      const headers = lines[0].split(',').map(h => h.trim());
      const headerRow = document.createElement('tr');

      // NEW: Add a blank header cell at the very beginning
      const blankHeader = document.createElement('th');
      blankHeader.textContent = '';
      headerRow.appendChild(blankHeader);

      headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      thead.className = 'row-header';

      // Rows
      lines.slice(1).forEach((line, idx) => {
        const cols = line.split(',').map(c => c.trim());
        if (cols.length < headers.length) return;

        const row = document.createElement('tr');
        row.className = idx % 2 === 0
          ? 'row-odd text-center js-table-text bg-opacity-70 transition'
          : 'row-even text-center js-table-text bg-opacity-70 transition';

        // NEW: Add a blank cell at the very start of each row
        const blankTd = document.createElement('td');
        blankTd.textContent = '';
        row.appendChild(blankTd);

        cols.forEach((col, colIndex) => {
          const td = document.createElement('td');

          // First column icon (existing behavior)
          if (colIndex === 0 && firstColIsIcon) {
            td.innerHTML = `<i class="fas ${col} text-gray-600"></i>`;
            td.classList.add('text-center');
            row.appendChild(td);
            return;
          }

          // Find @video tokens and strip them from visible text
          const videoRegex = /@([^\s,;]+?\.(mp4|webm|ogg|mov|m4v|mpg|mpeg))/i;
          const videoMatch = col.match(videoRegex);
          const visibleText = col.replace(/@\S+\.(mp4|webm|ogg|mov|m4v|mpg|mpeg)/ig, '').trim();

          td.innerHTML = '';
          const frag = document.createDocumentFragment();

          if (videoMatch) {
            const fileName = videoMatch[1];
            const src = resolveVideoSrc(fileName, table);

            const icon = document.createElement('i');
            icon.className = 'fas fa-video tm-text-gold mr-2 cursor-pointer align-middle';
            icon.setAttribute('aria-label', 'Play video');
            icon.setAttribute('title', 'Play video');

            const openModal = () => {
              if (__isVideoModalOpen) return;
              getVideoModal().show(src);
            };
            icon.addEventListener('mouseenter', openModal);
            td.addEventListener('mouseenter', openModal);
            icon.addEventListener('click', openModal);
            td.addEventListener('click', openModal);

            frag.appendChild(icon);
          }

          const textSpan = document.createElement('span');
          textSpan.textContent = visibleText;
          frag.appendChild(textSpan);

          td.appendChild(frag);
          row.appendChild(td);
        });

        tbody.appendChild(row);
      });
    });
}
