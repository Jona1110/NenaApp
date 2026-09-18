// Inicializar el mapa centrado en El Salto, Jalisco (puedes ajustar las coordenadas)
const map = L.map('map', { 
    zoomControl: false,
    attributionControl: false 
}).setView([20.556, -103.181], 15);

// Capa de mapa oscuro de CartoDB (gratuita y elegante)
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
}).addTo(map);

let marcadores = {};
let ultimaPosicion = null;
let camionSeleccionado = null;

function actualizarMapa() {
    if (APP_CONFIG.WEB_APP_URL === "https://script.google.com/macros/s/AKfycby4jWu0ciqspcBOn-dSykConOxwqFsBdNfPEVwCHTw_n-V4rLqlbD7AvrByGl3eGRMhwg/exec") {
        console.warn("Falta configurar la URL de Apps Script en config.js");
        return;
    }

    fetch(APP_CONFIG.WEB_APP_URL)
        .then(res => res.json())
        .then(data => {
            if(data.length === 0) return;

            data.forEach(item => {
                const lat = parseFloat(item.lat);
                const lng = parseFloat(item.lng);
                const camionId = item.camion;
                
                // Actualizar la última posición global o la del seleccionado
                if(!camionSeleccionado || camionSeleccionado === camionId) {
                    ultimaPosicion = [lat, lng];
                    actualizarTarjetaUI(camionId);
                }

                if (marcadores[camionId]) {
                    // Mover marcador existente suavemente
                    marcadores[camionId].setLatLng([lat, lng]);
                } else {
                    // Crear nuevo marcador estilizado
                    const htmlIcon = `
                        <div class="camion-icon">
                            <span>🚛</span> ${camionId}
                            <div class="pulse-dot"></div>
                        </div>`;
                        
                    const iconoCamion = L.divIcon({
                        className: 'custom-marker',
                        html: htmlIcon,
                        iconSize: [100, 40],
                        iconAnchor: [50, 40] // Anclaje en la punta del triángulo inferior
                    });

                    marcadores[camionId] = L.marker([lat, lng], { icon: iconoCamion }).addTo(map)
                        .on('click', () => {
                            camionSeleccionado = camionId;
                            ultimaPosicion = [lat, lng];
                            actualizarTarjetaUI(camionId);
                            centrarMapa();
                        });
                }
            });
        })
        .catch(err => console.error("Error obteniendo GPS:", err));
}

function actualizarTarjetaUI(camionId) {
    document.getElementById("infoCamion").textContent = camionId;
    document.getElementById("infoDetalle").textContent = "A 2 calles de ti • Llega en 4 min";
    
    const badge = document.getElementById("badgeEstado");
    badge.textContent = "En Ruta";
    badge.className = "px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs rounded-full font-semibold";
}

function centrarMapa() {
    if (ultimaPosicion) {
        map.flyTo(ultimaPosicion, 17, { animate: true, duration: 1.5 });
    }
}

// Bucle de actualización
setInterval(actualizarMapa, APP_CONFIG.ACTUALIZACION_MS);
actualizarMapa(); // Primera llamada inmediata
