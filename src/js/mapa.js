(function() {
    const lat = -27.337793;
    const lng = -55.8604449;
    const mapa = L.map('mapa').setView([lat, lng ], 30);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);


})()