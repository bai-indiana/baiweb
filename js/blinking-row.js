
const DEBUG = false; // turn on to see which rows are detected

function highlightActiveRow() {
  const now = new Date();
  const dayMap = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = dayMap[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // ---------- Auto-select tab by day (fallback to first available) ----------
  const activeTabId = today + '-tab';
  const availableTabs = Array.from(document.querySelectorAll('.tab-btn')).map(btn => btn.dataset.tab);
  const finalTabId = availableTabs.includes(activeTabId) ? activeTabId : availableTabs[0];

  if (typeof setActiveTab === 'function') setActiveTab(finalTabId);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active-tab', btn.dataset.tab === finalTabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('hidden', content.id !== finalTabId);
  });

  // ---------- Process visible table(s) ----------
  const allTables = document.querySelectorAll('table[id]');
  allTables.forEach(table => {
    const isVisible = !table.closest('.tab-content')?.classList.contains('hidden');
    if (!isVisible) return;

    const idx = detectColumnIndexes(table);
    if (idx.time < 0 || idx.event < 0) {
      console.warn('Time/Event columns not detected for table:', table.id, idx);
      return;
    }

    // Clear old flags
    table.querySelectorAll('tbody tr').forEach(tr => {
      tr.classList.remove('blink-row');
      tr.removeAttribute('data-active');
      tr.removeAttribute('data-upnext');
    });

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const activeRows = [];
    let nextRow = null;
    let nextRowStartMin = Number.POSITIVE_INFINITY;

    rows.forEach((row, rowIdx) => {
      const tds = row.querySelectorAll('td');
      const timeCell = tds[idx.time];
      const eventCell = tds[idx.event];
      if (!timeCell) return;

      const timeTextRaw = (timeCell.textContent || '').trim();
      const timeText = normalizeDashes(timeTextRaw).replace(/\s+/g, ' ');
      const eventName = eventCell ? (eventCell.textContent || '').trim() : '';

      const range = parseTimeRangeToMinutes(timeText);
      if (range) {
        const { startMin, endMin } = range;
        if (currentMinutes >= startMin && currentMinutes <= endMin) {
          activeRows.push(row);
          row.dataset.active = '1';
          if (DEBUG) console.log('[ACTIVE]', table.id, rowIdx, eventName, timeText, startMin, endMin);
        } else if (currentMinutes < startMin && startMin < nextRowStartMin) {
          nextRowStartMin = startMin;
          nextRow = row;
          if (DEBUG) console.log('[CANDIDATE NEXT]', table.id, rowIdx, eventName, timeText, startMin);
        }
      } else {
        if (DEBUG) console.warn('Time format mismatch:', { table: table.id, row: rowIdx, eventName, timeText: timeTextRaw });
      }
    });

    // Blink ALL active rows; otherwise blink the earliest upcoming one
    if (activeRows.length) {
      activeRows.forEach(r => r.classList.add('blink-row'));
    } else if (nextRow) {
      nextRow.classList.add('blink-row');
      nextRow.dataset.upnext = '1';
    }

    if (DEBUG) console.log(`Table ${table.id}: active=${activeRows.length} next=${!!nextRow}`);
  });

  // Center after highlighting
  centerBlinkRow();

  // ---------- helpers ----------
  function detectColumnIndexes(table) {
    const headRow = table.querySelector('thead tr');
    const headers = headRow ? Array.from(headRow.children) : [];
    let timeIdx = -1, eventIdx = -1;

    headers.forEach((th, i) => {
      const txt = (th.textContent || '').trim().toLowerCase();
      if (timeIdx < 0 && txt.startsWith('time')) timeIdx = i;
      if (eventIdx < 0 && txt.startsWith('event')) eventIdx = i;
    });

    // Fallback heuristics
    if (timeIdx < 0 && headers.length) {
      const guess = headers.findIndex(h => {
        const t = (h.textContent || '').toLowerCase();
        return t.includes('time');
      });
      if (guess >= 0) timeIdx = guess;
    }
    if (eventIdx < 0 && timeIdx >= 0 && headers[timeIdx + 1]) eventIdx = timeIdx + 1;

    return { time: timeIdx, event: eventIdx };
  }

  function normalizeDashes(s) {
    // replace en/em dashes with hyphen
    return s.replace(/[–—]/g, '-');
  }

  function parseTimeRangeToMinutes(text) {
    // Accepts:
    // "9:30 AM - 11 AM", "09:00 - 11:30" (24h), "3 PM - 4 PM", "10:15am-12:00pm"
    const parts = text.split('-').map(p => p.trim());
    if (parts.length === 2) {
      const a = parseClock(parts[0]);
      const b = parseClock(parts[1], a?.ampm); // carry AM/PM if right side lacks it
      if (a && b) {
        let startMin = a.minutes;
        let endMin = b.minutes;
        // If end rolls past midnight or is earlier due to missing meridian, gently correct:
        if (endMin < startMin) {
          // assume same-day event finishing after start; add 12h if meridian ambiguity
          if (a.ampm && !b.ampm) endMin += 12 * 60;
          if (endMin < startMin) endMin = startMin; // final guard
        }
        return { startMin, endMin };
      }
      return null;
    }

    // Single time "3 PM" (assume 60 mins)
    const single = parseClock(text);
    if (single) {
      return { startMin: single.minutes, endMin: single.minutes + 60 };
    }
    return null;
  }

  function parseClock(token, carryAmPm) {
    const t = token.toUpperCase().replace(/\s+/g, ' ').trim();

    // 12-hour with optional minutes, optional AM/PM (but may be provided on either side)
    const m12 = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (m12) {
      let h = parseInt(m12[1], 10);
      let mi = m12[2] ? parseInt(m12[2], 10) : 0;
      let mer = (m12[3] || carryAmPm || '').toUpperCase();

      if (!mer && h <= 24) {
        // Could be 24-hour like "13:30" (falls through to 24h below). Handle here only if <=12.
        if (h > 12) { /* fall through to 24h */ }
        else {
          // Default to closest interpretation: if carry provided from the other side, use it.
          // If none, assume AM for 1-7, PM for 8-12 (tweak if you like).
          mer = carryAmPm || (h >= 8 ? 'PM' : 'AM');
        }
      }

      if (mer === 'PM' && h !== 12) h += 12;
      if (mer === 'AM' && h === 12) h = 0;

      // If still no meridian AND hour > 12, treat as 24-hour
      if (!mer && h > 12) {
        // handled by 24-hour parser below
      } else {
        return { minutes: (h * 60 + mi), ampm: mer || null };
      }
    }

    // 24-hour "13:05" or "9:00"
    const m24 = t.match(/^(\d{1,2})(?::(\d{2}))$/);
    if (m24) {
      let h = parseInt(m24[1], 10);
      let mi = parseInt(m24[2], 10);
      if (h >= 0 && h < 24 && mi >= 0 && mi < 60) {
        return { minutes: (h * 60 + mi), ampm: null };
      }
    }

    return null;
  }
}

/* ---------- center last blinking row ---------- */
function centerBlinkRow() {
  const blinks = document.querySelectorAll('.blink-row');
  if (!blinks.length) return;

  const last = blinks[blinks.length - 1];

  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const isReload = nav && nav.type === 'reload';

  // If your table is inside a scrollable container, set selector here:
  // const container = document.querySelector('.your-scroll-container');
  // if (container) return centerInContainer(last, container, isReload ? 'auto' : 'smooth');

  centerInWindow(last, isReload ? 'auto' : 'smooth');
}

function centerInWindow(el, behavior = 'smooth') {
  const rect = el.getBoundingClientRect();
  const elCenter = rect.top + window.scrollY + rect.height / 2;
  window.scrollTo({
    top: Math.max(0, elCenter - (window.innerHeight / 2)),
    behavior
  });
}

function centerInContainer(el, container, behavior = 'smooth') {
  const elRect = el.getBoundingClientRect();
  const cRect  = container.getBoundingClientRect();
  const offsetTop = elRect.top - cRect.top + container.scrollTop;
  const target = Math.max(0, offsetTop - (container.clientHeight / 2) + (elRect.height / 2));
  container.scrollTo({ top: target, behavior });
}

/* ---------- bootstrapping & refresh ---------- */
document.addEventListener('DOMContentLoaded', () => {
  highlightActiveRow();
});
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    highlightActiveRow();
    requestAnimationFrame(centerBlinkRow);
  }
});
