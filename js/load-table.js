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
            headers.forEach((header) => {
                const th = document.createElement('th');
                th.className = 'py-2 px-4';
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            thead.className = 'bg-black bg-opacity-70 text-white';

            // Rows
            lines.slice(1).forEach((line, idx) => {
                const cols = line.split(',').map(c => c.trim());
                if (cols.length < headers.length) return;

                const row = document.createElement('tr');
                row.className = idx % 2 === 0
                    ? 'bg-gold text-center js-table-text  bg-opacity-70 transition'
                    : 'bg-gold1 text-center  js-table-text bg-opacity-70 transition';

                cols.forEach((col, colIndex) => {
                    const td = document.createElement('td');
                    td.className = 'py-2 px-4';

                    if (colIndex === 0 && firstColIsIcon) {
                        td.innerHTML = `<i class="fas ${col} text-gray-600"></i>`;
                        td.classList.add('text-center');
                    } else {
                        td.textContent = col;
                    }

                    row.appendChild(td);
                });

                tbody.appendChild(row);
            });
        });
}
