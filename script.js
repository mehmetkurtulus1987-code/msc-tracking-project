async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen bir konteyner numarası girin.");
        return;
    }

    console.log("Sorgulama başladı: " + no);
    
    // Daha kararlı bir proxy servisi deniyoruz
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        
        if (!response.ok) throw new Error("Ağ yanıtı düzgün değil.");

        const wrapper = await response.json();
        // AllOrigins servisi veriyi 'contents' içinde string olarak döndürür
        const data = JSON.parse(wrapper.contents);
        
        console.log("Veri alındı:", data);

        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const lastEvent = events[events.length - 1] || {};
            const firstEvent = events[0] || {};

            // HTML ID'lerinizin kts_main.html ile uyumlu olduğundan emin olun
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${lastEvent.VesselName || ''} ${lastEvent.VoyageNo || ''}`;
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Socar Aliaga Terminal";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Venice, IT";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "40' DRY VAN";

            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Konteyner verisi bulunamadı.");
        }

    } catch (error) {
        console.error("Hata Detayı:", error);
        alert("Bağlantı sorunu! MSC şu an erişimi engelliyor olabilir. Lütfen bir süre sonra tekrar deneyin veya tarayıcınıza 'CORS Unblock' eklentisi kurun.");
    }
}
