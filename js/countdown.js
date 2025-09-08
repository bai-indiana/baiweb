 const YEAR = 2025, MONTH_INDEX = 8, DAY = 26; // September = 8 (0‑based)
    const HOUR = 0, MINUTE = 0, SECOND = 0;
    const target = new Date(YEAR, MONTH_INDEX, DAY, HOUR, MINUTE, SECOND);

    const $d = document.getElementById('dd');
    const $h = document.getElementById('hh');
    const $m = document.getElementById('mm');
    const $s = document.getElementById('ss');
    const $footer = document.getElementById('countdown-footer');

    function pad(n) { return String(n).padStart(2, '0'); }

    function render(ms) {
      if (ms <= 0) {
        $d.textContent = '00';
        $h.textContent = '00';
        $m.textContent = '00';
        $s.textContent = '00';
        $footer.textContent = 'It\'s Pujo time! 🎉 শুভ পূজো!';
        return true;
      }
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      $d.textContent = pad(days);
      $h.textContent = pad(hours);
      $m.textContent = pad(minutes);
      $s.textContent = pad(seconds);
      return false;
    }

    function tick() {
      const now = new Date();
      const done = render(target - now);
      if (!done) setTimeout(tick, 1000);
    }

    tick();