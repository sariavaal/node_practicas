(function() {
    const lat = -27.337793;
    const lng = -55.8604449;
    const mapa = L.map('mapa').setView([lat, lng ], 30);
    let marker;
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //el pin
    marker = new L.marker([lat, lng], {
        draggable: true, //mover cursor
        autoPan: true //mover cursor junto con el mapa
    })
    .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng ))
    })


})()