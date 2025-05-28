$(document).ready(function () {

    /*
    Open your CSV file in Google Sheets.
    
    Go to File > Share > Publish to web.
    
    Choose Comma-separated values (.csv) and copy the published CSV URL (will look like below):
    */
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRdHbhGG0RjGR6vkZeCOcYfNqPRFR9JXDaf8kS8LMHimwmuD0cP5JsoVkcgn2IQCQWmm2rzsex6JWIC/pub?gid=2120635958&single=true&output=csv';

    fetch(csvUrl)
        .then(response => {
            if (!response.ok) throw new Error('Accommodation CSV file not found');
            return response.text();
        })
        .then(text => {
            const hotels = parseCSV(text);
            const container = $('#hotel-container');
            container.empty();

            hotels.forEach((hotel, index) => {
                const {
                    Hotel, Street, City, State, Zip, Phone,
                    Rate1, Rate2, Rate3, Rate4,
                    'Promo Code': Promo, Book, 'Open Map': Map
                } = hotel;

                const rates = [Rate1, Rate2, Rate3, Rate4].filter(r => r).join('<br>');
                const imageOrder = index % 2 === 1 ? 'order-last' : 'order-first';
                const buttonOrder = index % 2 === 1 ? 'text-left' : 'text-right';

                const card = `
                    <div class="flex-1 m-5 rounded-xl px-4 py-6 sm:px-8 sm:py-10 bg-black bg-opacity-60 tm-item-container space-y-16">
                        <div class="flex items-start mb-6 tm-menu-item">
                            <img alt="Hotels" class="rounded-md ${imageOrder}" src="img/hotel.png">
                            <div class="ml-3 sm:ml-6">
                                <h3 class="tm-text-gold text-xl font-semibold mb-2 flex items-center">
                                    <a href="${Book}" target="_blank" class="ml-2 underline">${Hotel}</a>
                                </h3>
                                <ul class="text-white text-sm space-y-3" style="letter-spacing: .05rem">
                                    <li class="flex"><span class="w-28 font-semibold text-gray-300">Address:</span><span class="flex-1">${Street}, ${City}, ${State} ${Zip}</span></li>
                                    <li class="flex"><span class="w-28 font-semibold text-gray-300">Phone:</span><span class="flex-1">${Phone}</span></li>
                                    <li class="flex"><span class="w-28 font-semibold text-gray-300">Rates:</span><span class="flex-1">${rates}</span></li>
                                    <li class="flex"><span class="w-28 font-semibold text-gray-300">Promo Code:</span><span class="flex-1">${Promo || 'TBD'}</span></li>
                                </ul>
                                <div class="mt-5 ${buttonOrder}">
                                    <a class="inline-block tm-bg-gold transition text-black font-semibold pt-2 pb-3 px-8 rounded-md" target="_blank" href="${Book}">
                                        <i class="fas fa-hotel mr-3"></i>Book
                                    </a>
                                </div>
                                <div class="mt-5 ${buttonOrder}">
                                    <a class="inline-block tm-bg-gold transition text-black font-semibold pt-2 pb-3 px-8 rounded-md" target="_blank" href="${Map}">
                                        <i class="fas fa-map-marked-alt mr-3"></i>Open Map
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.append(card);
            });
        })
        .catch(error => {
            console.error('Error loading accommodation CSV:', error);
            $('#hotel-container').html('<p class="text-red-30 font-bold text-center p-6">Unable to load accommodation data.</p>');
        });

    function parseCSV(text) {
        const rows = text.trim().split('\n');
        const headers = rows[0].split(',').map(h => h.trim());
        return rows.slice(1).map(row => {
            const values = row.split(',').map(v => v.trim());
            const obj = {};
            headers.forEach((h, i) => obj[h] = values[i] || '');
            return obj;
        });
    }
});
