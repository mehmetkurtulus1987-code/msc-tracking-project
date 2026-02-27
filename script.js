async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen konteyner numarası girin.");
        return;
    }

    // Mobil tarayıcılar ve kısıtlı PC'ler için en kararlı aracı (AllOrigins)
    // 'https://api.allorigins.win/get?url=' yapısı veriyi 'ham metin' olarak paketler.
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    console.log("Sorgu gönderiliyor...");

    try {
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Proxy bağlantı hatası");

        const wrapper = await response.json();
        
        // Gelen veri AllOrigins tarafından 'contents' içine metin olarak gömülür.
        // Onu JSON nesnesine çeviriyoruz.
        const data = JSON.parse(wrapper.contents);
        
        if (data.TrackingResults && data.TrackingResults.length > 0) {
            const res = data.TrackingResults[0];
            const events = res.Events || [];
            const lastEvent = events.length > 0 ? events[events.length - 1] : {};
            const firstEvent = events.length > 0 ? events[0] : {};

            // Ekrana yazdırma işlemi
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = (lastEvent.VesselName || "Yükleniyor") + " " + (lastEvent.VoyageNo || "");
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Bekleniyor";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilinmiyor";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "N/A";

            // Sonuçları göster
            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Konteyner bulunamadı. Lütfen numarayı kontrol edin.");
        }

    } catch (error) {
        console.error("Hata:", error);
        alert("Erişim Engellendi: MSC sunucusu şu an bu sorguya izin vermiyor. \n\nİpucu: Mobil verinizi (4.5G) açıp sayfayı yenilemeyi deneyin.");
    }
}
