const map = L.map('map-container').setView([12.9716, 77.5946], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; CARTO'
}).addTo(map);

// Data remains the same
const locations = [
    { name: 'Third Wave Coffee', type: 'cafe', latlng: [12.9345, 77.6221] },
    { name: 'Matteo Coffea', type: 'cafe', latlng: [12.9719, 77.6061] },
    { name: 'Blue Tokai', type: 'cafe', latlng: [12.9784, 77.6405] },
    { name: 'Karavalli', type: 'restaurant', latlng: [12.9735, 77.6105] },
    { name: 'MTR', type: 'restaurant', latlng: [12.9551, 77.5844] },
    { name: 'Truffles', type: 'restaurant', latlng: [12.9710, 77.6001] },
    { name: 'Toit', type: 'bar_pub', latlng: [12.9791, 77.6407] },
    { name: 'Arbor Brewing', type: 'bar_pub', latlng: [12.9712, 77.6099] },
    { name: 'Skyye', type: 'bar_pub', latlng: [12.9718, 77.5952] },
    { name: 'Windmills', type: 'bar_pub', latlng: [12.9831, 77.7215] }
];

let markerLayer = L.layerGroup().addTo(map);

function updateMarkers(category) {
    markerLayer.clearLayers();
    const filtered = category === 'all' ? locations : locations.filter(l => l.type === category);

    filtered.forEach(loc => {
        // Custom circle marker to match minimalist design
        L.circleMarker(loc.latlng, {
            radius: 8,
            fillColor: "#ff5a5f",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        })
        .bindPopup(`<strong>${loc.name}</strong>`, { closeButton: false })
        .addTo(markerLayer);
    });

    if (filtered.length > 0) {
        const bounds = L.latLngBounds(filtered.map(l => l.latlng));
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
    }
}

// Initialize Scrollama
const scroller = scrollama();

scroller
    .setup({
        step: ".step",
        offset: 0.5,
        debug: false
    })
    .onStepEnter(response => {
        const category = response.element.dataset.category;

        // Update UI states
        document.querySelectorAll('.step').forEach(s => s.classList.remove('is-active'));
        response.element.classList.add('is-active');

        updateMarkers(category);
    });

window.addEventListener("resize", scroller.resize);
