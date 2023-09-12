(function() {
    const lat = -27.337793;
    const lng = -55.8604449;
    const mapa = L.map('mapa').setView([lat, lng ], 30);
    let marker;

    //utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    

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

        //obtener informacion de las calles
        geocodeService.reverse().latlng(posicion, 20).run(function(error, resultado){
           // console.log(resultado)

            marker.bindPopup(resultado.address.LongLabel)

            //llenar los campos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
        })



    })


})()