let watchId = null;

function toggleRuta() {
    const btn = document.getElementById("btnToggle");
    const status = document.getElementById("status");
    const statusIcon = document.getElementById("statusIcon");
    const coordsDiv = document.getElementById("coords");
    const camionId = document.getElementById("camionId").value;

    if (APP_CONFIG.WEB_APP_URL === "https://script.google.com/macros/s/AKfycby4jWu0ciqspcBOn-dSykConOxwqFsBdNfPEVwCHTw_n-V4rLqlbD7AvrByGl3eGRMhwg/exec") {
        alert("Por favor, configura tu URL de Apps Script en config.js primero.");
        return;
    }

    if (watchId === null) {
        if (!navigator.geolocation) {
            alert("Tu dispositivo no soporta geolocalización.");
            return;
        }

        // UI: Estado Activo
        btn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Detener Transmisión`;
        btn.classList.replace("bg-emerald-600", "bg-rose-600");
        btn.classList.replace("hover:bg-emerald-500", "hover:bg-rose-500");
        btn.classList.replace("shadow-emerald-600/30", "shadow-rose-600/30");
        
        status.textContent = "Transmitiendo en vivo";
        status.className = "text-sm font-semibold text-emerald-400";
        statusIcon.className = "w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse mb-2";

        // Iniciar rastreo de alta precisión
        watchId = navigator.geolocation.watchPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                coordsDiv.textContent = `Lat: ${lat.toFixed(5)} | Lng: ${lng.toFixed(5)}`;
                enviarUbicacion(camionId, lat, lng);
            },
            (error) => {
                console.error("Error GPS:", error);
                coordsDiv.textContent = `Error: ${error.message}`;
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
        );
    } else {
        // Detener rastreo
        navigator.geolocation.clearWatch(watchId);
        watchId = null;

        // UI: Estado Inactivo
        btn.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Iniciar Transmisión`;
        btn.classList.replace("bg-rose-600", "bg-emerald-600");
        btn.classList.replace("hover:bg-rose-500", "hover:bg-emerald-500");
        btn.classList.replace("shadow-rose-600/30", "shadow-emerald-600/30");
        
        status.textContent = "Transmisión Inactiva";
        status.className = "text-sm font-semibold text-slate-400";
        statusIcon.className = "w-4 h-4 rounded-full bg-slate-600 mb-2";
        coordsDiv.textContent = "Lat: --- | Lng: ---";
    }
}

function enviarUbicacion(camion, lat, lng) {
    fetch(APP_CONFIG.WEB_APP_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ camion, lat, lng })
    }).catch(err => console.error("Fallo al enviar:", err));
}
