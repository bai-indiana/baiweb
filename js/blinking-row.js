document.addEventListener('DOMContentLoaded', function () {
    const now = new Date();
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayMap[now.getDay()];
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Automatically select tab based on current day
    const activeTabId = today + '-tab';

    // Set active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === activeTabId) {
            btn.classList.add('active-tab');
        } else {
            btn.classList.remove('active-tab');
        }
    });

    // Set visible content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === activeTabId) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });

    // Get active tab's table (visible one)
    const allTables = document.querySelectorAll('table[id]');
    allTables.forEach(table => {
        const tableId = table.id.toLowerCase();
        const isVisible = !table.closest('.tab-content')?.classList.contains('hidden');
        if (!isVisible) return;

        const rows = table.querySelectorAll('tbody tr');
        let activeRowFound = false;
        let nextRow = null;

        rows.forEach(row => {
            const timeCell = row.querySelectorAll('td')[1];
            const eventCell = row.querySelectorAll('td')[2];
            if (!timeCell) return;

            const timeText = timeCell.textContent.trim();
            const eventName = eventCell.textContent.trim();
            let startMin = null, endMin = null;

            const timeRangeMatch = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
            if (timeRangeMatch) {
                startMin = parseTimeToMinutes(timeRangeMatch[1], timeRangeMatch[2], timeRangeMatch[3]);
                endMin = parseTimeToMinutes(timeRangeMatch[4], timeRangeMatch[5], timeRangeMatch[6]);
            } else {
                const singleTimeMatch = timeText.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
                if (singleTimeMatch) {
                    startMin = parseTimeToMinutes(singleTimeMatch[1], singleTimeMatch[2], singleTimeMatch[3]);
                    endMin = startMin + 60; // default duration

                }
            }

            if (startMin !== null && endMin !== null) {
                if (currentMinutes >= startMin && currentMinutes <= endMin) {
                    row.classList.add('blink-row');
                    activeRowFound = true;
                } else if (!activeRowFound && currentMinutes < startMin && !nextRow) {
                    nextRow = row;
                }
            } else {
                alert(eventName + " time format mismatch " + timeText)
            }
        });

        if (!activeRowFound && nextRow) {
            nextRow.classList.add('blink-row');
        }
    });

    function parseTimeToMinutes(hourStr, minuteStr, ampm) {
        let hour = parseInt(hourStr);
        let minutes = minuteStr ? parseInt(minuteStr) : 0;
        if (ampm?.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (ampm?.toUpperCase() === 'AM' && hour === 12) hour = 0;
        return hour * 60 + minutes;
    }
});