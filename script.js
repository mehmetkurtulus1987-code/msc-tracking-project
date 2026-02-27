async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const loader = document.getElementById('loader');
    const resultCard = document.getElementById('resultCard');

    if (no.length < 5) {
        alert("Lütfen geçerli bir konteyner numarası girin.");
        return;
    }

    // Arayüzü güncelle
    loader.classList.remove('hidden');
    resultCard.classList.add('hidden');

    // CORS engelini aşmak için proxy kullanıyoruz
    const proxy = "https://corsproxy.io/?";
    const target = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;

    try {
        const response = await fetch(proxy + encodeURIComponent(target));
        if (!response.ok) throw new Error("Sunucu yanıt vermedi");

        const data = await response.json();
        const results = data.TrackingResults[0];

        if (results) {
            const events = results.Events || [];
            const lastEvent = events[events.length - 1] || {};
            const firstEvent = events[0] || {};

            // HTML alanlarını doldur
            document.getElementById('res_no').innerText = results.ContainerDetail.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${lastEvent.VesselName || 'Bilinmiyor'} ${lastEvent.VoyageNo || ''}`;
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = results.GeneralTrackingInfo.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = results.ContainerDetail.ContainerType || "Bilgi Yok";

            resultCard.classList.remove('hidden');
        } else {
            alert("Konteyner bulunamadı. Lütfen numarayı kontrol edin.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Veri çekilirken bir hata oluştu. MSC sunucusu isteği engellemiş olabilir.");
    } finally {
        loader.classList.add('hidden');
    }
}

// Enter tuşuyla sorgulama desteği
document.getElementById('containerInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        verileriGetir();
    }
});
