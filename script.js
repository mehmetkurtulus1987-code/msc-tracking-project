async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { alert("Lütfen numara girin."); return; }

    // Bu sefer 'ThingSpeak' veya 'Cloudflare Worker' mantığında çalışan 
    // daha az bilinen bir köprü deniyoruz.
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events[events.length - 1] || {};
            
            document.getElementById('res_no').innerText = res.ContainerDetail.ContainerNumber;
            document.getElementById('res_gemi').innerText = (last.VesselName || "") + " " + (last.VoyageNo || "");
            document.getElementById('res_tesis').innerText = events[0]?.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo.PortOfDischarge;
            document.getElementById('res_tur').innerText = res.ContainerDetail.ContainerType;

            resultCard.style.display = "block";
        } else {
            alert("Kayıt bulunamadı.");
        }
    } catch (error) {
        console.error(error);
        alert("Bu proxy de engellendi. Lütfen 2. yöntemi (Google Script) deneyelim.");
    }
}
