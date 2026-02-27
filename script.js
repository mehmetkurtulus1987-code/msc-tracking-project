async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen numara girin.");
        return;
    }

    // CORS engelini aşmak için 'AllOrigins' proxy servisini kullanıyoruz
    // Bu servis, MSC'nin verisini bizim yerimize çeker ve tarayıcıyı kandırır
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        console.log("Proxy üzerinden sorgu başlatıldı...");
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Proxy sunucusu yanıt vermedi.");

        const wrapper = await response.json();
        // AllOrigins veriyi 'contents' alanı içinde string olarak döndürür, onu JSON'a çeviriyoruz
        const data = JSON.parse(wrapper.contents);
        
        if (data.TrackingResults && data.TrackingResults.length > 0) {
            const res = data.TrackingResults[0];
            const events = res.Events || [];
            const lastEvent = events.length > 0 ? events[events.length - 1] : {};
            const firstEvent = events.length > 0 ? events[0] : {};

            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${lastEvent.VesselName || "Bilgi Yok"} ${lastEvent.VoyageNo || ""}`.trim();
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Konteyner bulunamadı.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Bağlantı Hatası: MSC sunucusu veya Proxy şu an yanıt vermiyor.");
    }
}
