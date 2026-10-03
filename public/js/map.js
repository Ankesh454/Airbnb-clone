const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 13 // st arting zoom
});

const marker = new mapboxgl.Marker({color:'black'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25,})
    .setHTML(`<h4>${listing.location}</h4><p>Exact Location!</p>`))
    .addTo(map);