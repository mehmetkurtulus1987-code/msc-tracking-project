async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen bir konteyner numarası girin.");
        return;
    }

    console.log("Sorgulanıyor: " + no);

    // Hedef MSC API adresi
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    
    // Eklentisiz çözüm için en güçlü aracı (AllOrigins)
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Bağlantı kurulamadı.");

        const wrapper = await response.json();
        
        // Gelen veri 'contents' içinde metin olarak saklanır, onu JSON'a çeviriyoruz
        const data = JSON.parse(wrapper.contents);
        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const lastEvent = events.length > 0 ? events[events.length - 1] : {};
            const firstEvent = events.length > 0 ? events[0] : {};

            // HTML'deki alanları dolduruyoruz
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = (lastEvent.VesselName || "Bilgi Yok") + " " + (lastEvent.VoyageNo || "");
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Sonuç kartını görünür yap
            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Konteyner bulunamadı. Lütfen numarayı kontrol edin.");
        }

    } catch (error) {
        console.error("Hata:", error);
        alert("Bağlantı Sorunu: MSC sunucusu şu an bu sorguyu reddetti. Lütfen birkaç dakika bekleyip tekrar deneyin veya farklı bir numara sorgulayın.");
    }
}
