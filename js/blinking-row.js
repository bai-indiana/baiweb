function highlightActiveRow() {
  const now = new Date();
  const dayMap = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const today = dayMap[now.getDay()];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Auto-select tab by day (fallback to first available)
  const activeTabId = today + '-tab';
  const availableTabs = Array.from(document.querySelectorAll('.tab-btn')).map(btn => btn.dataset.tab);
  const finalTabId = availableTabs.includes(activeTabId) ? activeTabId : availableTabs[0];

  setActiveTab(finalTabId);

  // Activate correct tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active-tab', btn.dataset.tab === finalTabId);
  });

  // Show matching tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('hidden', content.id !== finalTabId);
  });

  // Process the visible table(s)
  const allTables = document.querySelectorAll('table[id]');
  allTables.forEach(table => {
    const isVisible = !table.closest('.tab-content')?.classList.contains('hidden');
    if (!isVisible) return;

    // Clear old highlights so re-runs don't stack
    table.querySelectorAll('.blink-row').forEach(el => el.classList.remove('blink-row'));

    const rows = table.querySelectorAll('tbody tr');
    let activeRowFound = false;
    let nextRow = null;

    rows.forEach(row => {
      const tds = row.querySelectorAll('td');
      const timeCell = tds[1];
      const eventCell = tds[2];
      if (!timeCell) return;

      const timeText = timeCell.textContent.trim();
      const eventName = eventCell ? eventCell.textContent.trim() : '';

      let startMin = null, endMin = null;

      // Try range "9:30 AM - 11 AM"
      const range = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
      if (range) {
        startMin = parseTimeToMinutes(range[1], range[2], range[3]);
        endMin   = parseTimeToMinutes(range[4], range[5], range[6]);
      } else {
        // Try single time "3 PM" (assume 60 mins)
        const single = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
        if (single) {
          startMin = parseTimeToMinutes(single[1], single[2], single[3]);
          endMin = startMin + 60;
        }
      }

      if (startMin !== null && endMin !== null) {
        if (currentMinutes >= startMin && currentMinutes <= endMin) {
          row.classList.add('blink-row');
          activeRowFound = true;
        } else if (!activeRowFound && currentMinutes < startMin && !nextRow) {
          nextRow = row; // first upcoming row
        }
      } else {
        console.warn('Time format mismatch:', { eventName, timeText });
      }
    });

    if (!activeRowFound && nextRow) {
      nextRow.classList.add('blink-row');
    }
  });

  // After highlighting, center the last blinking row (if any)
  centerBlinkRow();

  function parseTimeToMinutes(hourStr, minuteStr, ampm) {
    let hour = parseInt(hourStr, 10);
    let minutes = minuteStr ? parseInt(minuteStr, 10) : 0;
    const mer = ampm ? ampm.toUpperCase() : null;
    if (mer === 'PM' && hour !== 12) hour += 12;
    if (mer === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minutes;
  }
}

/* ---------- helpers: center last blinking row ---------- */

function centerBlinkRow() {
  const blinks = document.querySelectorAll('.blink-row');
  if (!blinks.length) return;

  const last = blinks[blinks.length - 1];

  // Prefer instant centering right after a page reload; smooth otherwise
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
  const viewportCenter = window.scrollY + window.innerHeight / 2;

  window.scrollTo({
    top: Math.max(0, elCenter - (window.innerHeight / 2)),
    behavior
  });
}

// If your table lives in an overflowed container, use this instead and pass it that container
function centerInContainer(el, container, behavior = 'smooth') {
  const elRect = el.getBoundingClientRect();
  const cRect  = container.getBoundingClientRect();
  const offsetTop = elRect.top - cRect.top + container.scrollTop;

  const target = Math.max(0, offsetTop - (container.clientHeight / 2) + (elRect.height / 2));
  container.scrollTo({ top: target, behavior });
}

/* ---------- bootstrapping & refresh ---------- */

document.addEventListener('DOMContentLoaded', () => {
  // run once on load
  highlightActiveRow();
 
});

// Re-center when returning to the tab
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    highlightActiveRow(); // re-evaluate rows
    // ensure centering happens after DOM paints
    requestAnimationFrame(centerBlinkRow);
  }
});
 
