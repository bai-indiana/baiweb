// Function to fetch and parse the CSV file
async function fetchCommitteeData() {
        /*
    Open your CSV file in Google Sheets.
    
    Go to File > Share > Publish to web.
    
    Choose Comma-separated values (.csv) and copy the published CSV URL (will look like below):
    */
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTA8L83Ws2PQ_Bm255fMCG3KMgmLs1r8nIpqqvtJykDXWwPPNss_AfqasypGeffBKsq6uDORI6GA6NM/pub?gid=1823466229&single=true&output=csv';

    try {
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('CSV file not found or not accessible');
        const data = await response.text();
        const rows = data.trim().split('\n');
        const headers = rows[0].split(',');

        const committees = rows.slice(1).map(row => {
            const values = row.split(',');
            const committee = {};
            headers.forEach((header, index) => {
                committee[header.trim()] = values[index] ? values[index].trim() : '';
            });
            return committee;
        });

        renderCommittees(committees);
    } catch (error) {
        console.error('Error fetching committee data:', error);
        const container = document.getElementById('committee-container');
        container.innerHTML = '<p class="text-red-30 font-semibold">Committee data not found.</p>';
    }
}


// Format Co-Chair and Other Members
function formatMultiLine(label, data) {
    if (!data) return '';
    const names = data.split(';').map(name => name.trim()).filter(name => name !== '');
    if (names.length === 0) return '';
    return `<p><strong>${label}:</strong><br>${names.map(n => `<span class="ml-4 block">${n}</span>`).join('')}</p>`;
}

// Scrollable Other Members (like movie credits)
function formatScrollingMembers(label, data) {
    if (!data) return '';
    const names = data.split(';').map(name => name.trim()).filter(name => name !== '');
    if (names.length === 0) return '';
    return `
    <p><strong>${label}:</strong></p>
    <div class="relative h-30 overflow-hidden">
        <div class="absolute animate-scroll-up space-y-1 pl-4">
            ${names.map(n => `<div>${n}</div>`).join('')}
        </div>
    </div>`;
}

// Function to render committee cards
function renderCommittees(committees) {
    const container = document.getElementById('committee-container');

    const iconMap = {
        'Puja': 'flower',
        'Cultural': 'music',
        'Fundraising': 'dollar-sign',
        'Food': 'utensils',
        'Brochure': 'book-open',
        'Registration': 'clipboard-list',
        'Venue': 'map-pin',
        'Operations': 'settings',
        'Logistics': 'truck',
        'Decoration': 'brush',
        'Kids': 'baby',
        'Communications': 'message-circle',
        'Healthcare': 'heart-pulse'
    };

    committees.forEach(committee => {
        const card = document.createElement('div');
        card.className = 'rounded-xl px-6 py-8 m-4 bg-white bg-opacity-90 shadow-xl transform hover:scale-105 transition-transform duration-300';

        const committeeName = committee['Committee Name'];
        const iconName = iconMap[committeeName] || 'users';
        const email = committee['Contacts'];

        card.innerHTML = `
        <div class="flex items-center text-lg font-semibold mb-3 text-gray-800">
            <i data-lucide="${iconName}" class="w-5 h-5 mr-2"></i> ${committeeName}
        </div>

        <p><strong>Chair:</strong> ${committee['Chair']}</p>
        ${formatMultiLine('Co-Chair', committee['Co-Chair'])}
        <p class="flex items-center mt-1">
            <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
            <a href="mailto:${email}" class="tm-text-black underline mr-2">${email}</a>
            <span onclick="copyToClipboard('${email}')" class="cursor-pointer" title="Click To Copy email">
                <i data-lucide="copy" class="w-4 h-4 text-gray-600 hover:text-black"></i>
            </span>
        </p>
        ${formatScrollingMembers('Other Members', committee['Other Members'])}
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

// Clipboard copy helper (silent)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => console.error('Copy failed:', err));
}

fetchCommitteeData();
