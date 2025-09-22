/* ========================= load-table.js (FULL) =========================
   - VIDEO modal: hover/click open, explicitly unmuted, scroll-locked
   - AUDIO modal: non-blocking overlay (page keeps scrolling), mini floater
   - Row controls: tiny icon Play/Pause (left), Seek (center, grows), Stop (right)
   - CSV cells support @video and @audio tokens
   - Keeps firstColIsIcon behavior and leading blank header/cell
========================================================================== */

/* --- Small icon toggle helper for audio --- */
function __setAudioToggleState(btn, state /* 'play' | 'pause' */) {
  if (!btn) return;
  btn.dataset.state = state;
  btn.setAttribute('aria-pressed', state === 'pause' ? 'true' : 'false');
  btn.setAttribute('aria-label', state === 'pause' ? 'Pause audio' : 'Play audio');
  btn.title = state === 'pause' ? 'Pause' : 'Play';
  btn.innerHTML = state === 'pause'
    ? '<i class="fas fa-pause"></i>'
    : '<i class="fas fa-play"></i>';
}

/* ---------- Single video modal (created once, reused) ---------- */
let __videoModal = null;
let __isVideoModalOpen = false;   // guard to prevent instant reopen on hover

function getVideoModal() {
  if (__videoModal) return __videoModal;

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'video-modal-overlay';
  overlay.className = 'video-modal-overlay'; // styled in CSS

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
    // lock scroll while open
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

/* ---------- Single audio modal (created once, reused) ---------- */
/* Non-blocking overlay so page keeps scrolling. Mini floating player. */
let __audioModal = null;
let __isAudioModalOpen = false;
let __activeAudioUI = null;   // { slider, toggleBtn, stopBtn, src }

function getAudioModal() {
  if (__audioModal) return __audioModal;

  // Overlay (non-blocking: lets page scroll & click through)
  const overlay = document.createElement('div');
  overlay.id = 'audio-modal-overlay';
  overlay.className = 'audio-modal-overlay nonblocking';

  // Floating mini panel (clickable)
  const modal = document.createElement('div');
  modal.className = 'audio-modal mini';

  const audio = document.createElement('audio');
  audio.preload = 'metadata';
  audio.setAttribute('autoplay', '');
  audio.setAttribute('controls', ''); // keep native; remove if you want only custom
  // NOTE: never touch audio.muted

  modal.appendChild(audio);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const tryPlayWithFallback = () =>
    audio.play().catch(() => {
      const once = () => {
        audio.play().finally(() => overlay.removeEventListener('click', once));
      };
      overlay.addEventListener('click', once, { once: true });
    });

  const show = (src) => {
    __isAudioModalOpen = true;
    if (!audio.src || !audio.currentSrc || !audio.currentSrc.endsWith(src)) {
      audio.src = src;
    }
    overlay.classList.add('show');
    try { audio.currentTime = audio.currentTime || 0; } catch (e) {}
    tryPlayWithFallback();
  };

  const pause = () => { try { audio.pause(); } catch (e) {} };

  const stop = () => {
    try { audio.pause(); } catch (e) {}
    audio.removeAttribute('src');
    audio.load();
    overlay.classList.remove('show');
    __isAudioModalOpen = false;

    // Reset active UI labels/seek
    if (__activeAudioUI) {
      __setAudioToggleState(__activeAudioUI.toggleBtn, 'play');
      if (__activeAudioUI.slider) __activeAudioUI.slider.value = 0;
    }
  };

  // Sync UI on metadata/time changes
  audio.addEventListener('loadedmetadata', () => {
    if (!__activeAudioUI) return;
    const d = audio.duration;
    if (isFinite(d) && d > 0 && __activeAudioUI.slider) {
      __activeAudioUI.slider.max = Math.floor(d);
      __activeAudioUI.slider.value = Math.floor(audio.currentTime || 0);
      __activeAudioUI.slider.disabled = false;
    }
  });

  audio.addEventListener('timeupdate', () => {
    if (!__activeAudioUI || !__activeAudioUI.slider) return;
    const d = audio.duration;
    if (isFinite(d) && d > 0) {
      __activeAudioUI.slider.max = Math.floor(d);
      __activeAudioUI.slider.value = Math.floor(audio.currentTime || 0);
    }
  });

  audio.addEventListener('play', () => {
    if (__activeAudioUI) __setAudioToggleState(__activeAudioUI.toggleBtn, 'pause');
  });

  audio.addEventListener('pause', () => {
    if (__activeAudioUI) __setAudioToggleState(__activeAudioUI.toggleBtn, 'play');
  });

  audio.addEventListener('ended', () => {
    if (__activeAudioUI) {
      __setAudioToggleState(__activeAudioUI.toggleBtn, 'play');
      if (__activeAudioUI.slider) __activeAudioUI.slider.value = 0;
    }
    // Auto-close on end (optional)
    stop();
  });

  // Backdrop click stops (overlay is nonblocking, panel is clickable)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) stop();
  });

  // Esc to stop
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('show')) stop();
  });

  __audioModal = { overlay, modal, audio, show, pause, stop };
  return __audioModal;
}

/* ---------- Helpers ---------- */
function resolveVideoSrc(file, tableEl) {
  const base = tableEl?.dataset?.videoBase || '';
  if (/^https?:\/\//i.test(file) || file.startsWith('/') || file.startsWith('./') || file.startsWith('../')) {
    return file;
  }
  return base ? base.replace(/\/?$/, '/') + file : file;
}
// Reuse for audio
const resolveAudioSrc = resolveVideoSrc;

/* ---------- Main function (with video & audio token support) ---------- */
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

      // Leading blank header cell
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

        // Leading blank cell
        const blankTd = document.createElement('td');
        blankTd.textContent = '';
        row.appendChild(blankTd);

        cols.forEach((col, colIndex) => {
          const td = document.createElement('td');

          // First column icon
          if (colIndex === 0 && firstColIsIcon) {
            td.innerHTML = `<i class="fas ${col} text-gray-600"></i>`;
            td.classList.add('text-center');
            row.appendChild(td);
            return;
          }

          // Detect media tokens
          const videoRegex = /@([^\s,;]+?\.(mp4|webm|ogg|mov|m4v|mpg|mpeg))/i;
          const audioRegex = /@([^\s,;]+?\.(mp3|wav|ogg|m4a|aac|flac))/i;

          const videoMatch = col.match(videoRegex);
          const audioMatch = col.match(audioRegex);

          // Strip media tokens from visible text
          const visibleText = col
            .replace(/@\S+\.(mp4|webm|ogg|mov|m4v|mpg|mpeg)/ig, '')
            .replace(/@\S+\.(mp3|wav|ogg|m4a|aac|flac)/ig, '')
            .trim();

          td.innerHTML = '';
          const frag = document.createDocumentFragment();

          // ---------- Video icon + handlers (as in your working JS) ----------
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
            // Hover + click
            icon.addEventListener('mouseenter', openModal);
            td.addEventListener('mouseenter', openModal);
            icon.addEventListener('click', openModal);
            td.addEventListener('click', openModal);

            frag.appendChild(icon);
          }

          // ---------- Cell text ----------
          const textSpan = document.createElement('span');
          textSpan.textContent = visibleText;
          frag.appendChild(textSpan);

          // ---------- Audio controls (compact row: [play/pause] [seek flex] [stop]) ----------
          if (audioMatch) {
            const fileName = audioMatch[1];
            const src = resolveAudioSrc(fileName, table);

            const controlsWrap = document.createElement('div');
            controlsWrap.className = 'audio-controls-row';

            // Toggle Play/Pause (icon-only, tiny)
            const btnToggle = document.createElement('button');
            btnToggle.type = 'button';
            btnToggle.className = 'btn-audio btn-icon btn-audio-toggle tiny';
            btnToggle.setAttribute('aria-label', 'Play audio');
            __setAudioToggleState(btnToggle, 'play'); // initial icon = play

            // Seek slider (flex-grow center)
            const seek = document.createElement('input');
            seek.type = 'range';
            seek.className = 'audio-seek flex-grow';
            seek.min = 0;
            seek.max = 0;            // set after metadata loads
            seek.value = 0;
            seek.disabled = true;    // enable after metadata loads
            seek.step = 1;

            // Stop (icon-only, tiny, right)
            const btnStop = document.createElement('button');
            btnStop.type = 'button';
            btnStop.className = 'btn-audio btn-icon btn-audio-stop tiny';
            btnStop.setAttribute('aria-label', 'Stop audio');
            btnStop.title = 'Stop';
            btnStop.innerHTML = '<i class="fas fa-stop"></i>';

            function registerActiveUI() {
              __activeAudioUI = { slider: seek, toggleBtn: btnToggle, stopBtn: btnStop, src: src };
            }

            btnToggle.addEventListener('click', () => {
              const am = getAudioModal();
              const currentSrc = am.audio.src;
              const same = !!currentSrc && (currentSrc === src || currentSrc.endsWith(fileName));
              registerActiveUI();

              if (!__isAudioModalOpen) {
                am.show(src);
                __setAudioToggleState(btnToggle, 'pause');
                return;
              }

              if (same) {
                if (am.audio.paused) {
                  am.audio.play();
                  __setAudioToggleState(btnToggle, 'pause');
                } else {
                  am.audio.pause();
                  __setAudioToggleState(btnToggle, 'play');
                }
              } else {
                // Switch to this track
                am.show(src);
                __setAudioToggleState(btnToggle, 'pause');
              }
            });

            btnStop.addEventListener('click', () => {
              const am = getAudioModal();
              if (__isAudioModalOpen) {
                am.stop();
                __setAudioToggleState(btnToggle, 'play');
                seek.value = 0;
              }
            });

            // Scrub on input
            seek.addEventListener('input', () => {
              const am = getAudioModal();
              registerActiveUI();
              const needOpen = !__isAudioModalOpen || !am.audio.src || (!am.audio.currentSrc.endsWith(fileName));
              if (needOpen) {
                am.show(src);
                setTimeout(() => {
                  am.audio.currentTime = Number(seek.value) || 0;
                }, 50);
              } else {
                am.audio.currentTime = Number(seek.value) || 0;
              }
            });

            // Assemble row: left toggle, center seek (flex), right stop
            controlsWrap.appendChild(btnToggle);
            controlsWrap.appendChild(seek);
            controlsWrap.appendChild(btnStop);
            frag.appendChild(controlsWrap);
          }

          td.appendChild(frag);
          row.appendChild(td);
        });

        tbody.appendChild(row);
      });
    });
}

