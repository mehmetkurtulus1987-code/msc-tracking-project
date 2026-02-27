async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen numara girin.");
        return;
    }

    // Proxy'yi aradan çıkardık, doğrudan MSC API'sine gidiyoruz
    const url = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        const data = await response.json();
        const res = data.TrackingResults[0];

        if (res) {
            const events = res.Events || [];
            const lastEvent = events[events.length - 1] || {};
            
            document.getElementById('res_no').innerText = res.ContainerDetail.ContainerNumber;
            document.getElementById('res_gemi').innerText = (lastEvent.VesselName || "") + " " + (lastEvent.VoyageNo || "");
            document.getElementById('res_tesis').innerText = events[0]?.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo.PortOfDischarge;
            document.getElementById('res_tur').innerText = res.ContainerDetail.ContainerType;

            resultCard.style.display = "block";
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("CORS Engeli: Lütfen tarayıcınıza 'Allow CORS' eklentisini kurun ve aktif edin.");
    }
}
