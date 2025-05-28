// Function to fetch and parse the CSV file
async function fetchCommitteeData() {
    try {
        const response = await fetch('data/TSDP-Committee2025.csv');
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
    <div class="relative h-20 overflow-hidden">
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

        card.innerHTML = `
        <div class="flex items-center text-lg font-semibold mb-3 text-gray-800">
            <i data-lucide="${iconName}" class="w-5 h-5 mr-2"></i> ${committeeName}
        </div>

        <p><strong>Chair:</strong> ${committee['Chair']}</p>
        ${formatMultiLine('Co-Chair', committee['Co-Chair'])}
        <p class="flex items-center mt-1">
            <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
            <a href="mailto:${committee['Contacts']}" class="text-blue-600 underline">${committee['Contacts']}</a>
        </p>
        ${formatScrollingMembers('Other Members', committee['Other Members'])}
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

fetchCommitteeData();
