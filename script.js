async function verileriGetir() {
    console.log("Butona tıklandı!"); // Tetiklenip tetiklenmediğini anlamak için

    const input = document.getElementById('containerInput');
    const resultCard = document.getElementById('resultCard');
    const no = input.value.trim().toUpperCase();

    if (!no) {
        alert("Lütfen bir konteyner numarası girin.");
        return;
    }

    console.log("Sorgulanan No:", no);

    // CORS Proxy servisi (Tarayıcı engelini aşmak için)
    const proxy = "https://corsproxy.io/?";
    const target = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;

    try {
        console.log("İstek gönderiliyor...");
        const response = await fetch(proxy + encodeURIComponent(target));
        
        if (!response.ok) {
            console.error("Sunucu hatası:", response.status);
            alert("Sunucuya ulaşılamadı. Proxy yoğun olabilir.");
            return;
        }

        const data = await response.json();
        console.log("Ham Veri Alındı:", data);

        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const lastEvent = events[events.length - 1] || {};
            const firstEvent = events[0] || {};

            // Verileri eşleştirme
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = (lastEvent.VesselName || "") + " " + (lastEvent.VoyageNo || "");
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Görünürlük ayarları
            resultCard.classList.remove('hidden');
            resultCard.style.display = "block"; // CSS'de çakışma olmaması için garantiye alıyoruz
            console.log("Sonuçlar ekrana basıldı.");
        } else {
            console.warn("Veri boş döndü.");
            alert("Konteyner bulunamadı.");
        }

    } catch (error) {
        console.error("Bir hata oluştu:", error);
        alert("Bağlantı hatası! Lütfen internetinizi veya Proxy durumunu kontrol edin.");
    }
}
