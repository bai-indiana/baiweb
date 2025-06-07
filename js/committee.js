// Function to fetch and parse the CSV file
async function fetchCommitteeData() {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQtABn9B48hVUe6_VEVF6jiicyuUaAM_aUlpPFFC3Ddgap2XXJL40gorA7uTmLCzEEo3gWV3UCwTIfR/pub?gid=2029730703&single=true&output=csv';

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

// 👑 Format name with icons
function formatNameWithIcon(name) {
    let icon = '';
    let cleanName = name;

    if (name.endsWith('**')) {
        icon = 'crown';
        cleanName = name.slice(0, -2).trim();
    } else if (name.endsWith('*e')) {
        icon = 'briefcase';
        cleanName = name.slice(0, -2).trim();
    } else if (name.endsWith('*')) {
        icon = 'user-check';
        cleanName = name.slice(0, -1).trim();
    }

    return `
        <span class="ml-4 block flex items-center space-x-2">
            ${icon ? `<i data-lucide="${icon}" class="w-4 h-4 text-gray-600"></i>` : ''}
            <span>${cleanName}</span>
        </span>`;
}

// Format Core/Co-Chair/Other Members
function formatMultiLine(label, data) {
    if (!data) return '';
    const names = data.split(';').map(name => name.trim()).filter(name => name !== '');
    if (names.length === 0) return '';
    return `<p><strong>${label}:</strong><br>${names.map(n => formatNameWithIcon(n)).join('')}</p>`;
}

// Scrollable Other Members
function formatScrollingMembers(label, data, committeeName) {
    if (!data) return '';
    const names = data.split(';').map(name => name.trim()).filter(name => name !== '');
    if (names.length === 0) return '';

    const scrollDuration = committeeName === 'Food' ? '40s' : '25s';

    return `
    <p><strong>${label}:</strong></p>
    <div class="sponsor-scroll-wrapper">
        <div class="scroll-content space-y-1 pl-4" style="--scroll-duration: ${scrollDuration};">
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            ${names.map(n => `<div class="flex items-center space-x-2">${formatNameWithIcon(n)}</div>`).join('')}
            <div>&nbsp;</div>
            <div>&nbsp;</div>
        </div>
    </div>`;
}

// Render committee cards
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

        ${formatMultiLine('Core Committee', committee['Core-Committee'])}
        <p class="flex items-center mt-1">
            <i data-lucide="mail" class="w-4 h-4 mr-2"></i>
            <a href="mailto:${email}" class="tm-text-black underline mr-2">${email}</a>
            <span onclick="copyToClipboard('${email}')" class="cursor-pointer" title="Click To Copy email">
                <i data-lucide="copy" class="w-4 h-4 text-gray-600 hover:text-black"></i>
            </span>
        </p>
        ${formatScrollingMembers('Extended Committee', committee['Extended-Committee'], committeeName)}
        `;

        container.appendChild(card);
    });

    lucide.createIcons();

    // Animate scroll for Other Members
    document.querySelectorAll('.sponsor-scroll-wrapper').forEach(wrapper => {
        const speed = parseFloat(wrapper.dataset.speed || '0.4');
        let isPaused = false;

        const scrollStep = () => {
            if (!isPaused) {
                wrapper.scrollTop += speed;
                if (wrapper.scrollTop >= wrapper.scrollHeight - wrapper.clientHeight) {
                    wrapper.scrollTop = 0;
                }
            }
            requestAnimationFrame(scrollStep);
        };

        wrapper.addEventListener('mouseenter', () => { isPaused = true; });
        wrapper.addEventListener('mouseleave', () => { isPaused = false; });
        wrapper.addEventListener('wheel', () => { isPaused = true; });

        requestAnimationFrame(scrollStep);
    });
}

// Clipboard copy helper
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => console.error('Copy failed:', err));
}

// Start everything
fetchCommitteeData();

