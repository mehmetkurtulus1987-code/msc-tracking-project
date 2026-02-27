async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen numara girin.");
        return;
    }

    console.log(`${no} sorgulanıyor...`);

    // AllOrigins proxy kullanarak tarayıcıdaki CORS engelini baypas ediyoruz
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Proxy bağlantısı başarısız.");

        const wrapper = await response.json();
        
        // Veri 'contents' içine hapsolmuş durumdadır, onu JSON'a çeviriyoruz
        const data = JSON.parse(wrapper.contents);
        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const lastEvent = events.length > 0 ? events[events.length - 1] : {};
            const firstEvent = events.length > 0 ? events[0] : {};

            // HTML elementlerini doldurma
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${lastEvent.VesselName || "Bilgi Yok"} ${lastEvent.VoyageNo || ""}`.trim();
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Kartı göster
            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Numara bulunamadı!");
        }

    } catch (error) {
        console.error("Hata Detayı:", error);
        alert("Bağlantı sorunu! MSC şu an erişimi engelliyor olabilir.\n\nLütfen tarayıcınızdaki 'Allow CORS' eklentisinin AÇIK (On) olduğundan emin olun.");
    }
}
