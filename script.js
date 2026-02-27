async function verileriGetir() {
    // HTML'deki ID'lerle eşleştiğinden emin olun
    const input = document.getElementById('containerInput');
    const resNo = document.getElementById('res_no');
    const resGemi = document.getElementById('res_gemi');
    const resTesis = document.getElementById('res_tesis');
    const resLiman = document.getElementById('res_liman');
    const resTur = document.getElementById('res_tur');
    const resultCard = document.getElementById('resultCard');

    const no = input.value.trim().toUpperCase();

    if (!no) {
        alert("Lütfen bir numara girin.");
        return;
    }

    console.log(no + " için sorgu başlıyor...");

    // Tarayıcı engelini aşmak için Proxy kullanımı
    const proxy = "https://corsproxy.io/?";
    const target = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;

    try {
        const response = await fetch(proxy + encodeURIComponent(target));
        const data = await response.json();
        const res = data.TrackingResults[0];

        if (res) {
            const events = res.Events || [];
            const lastEvent = events[events.length - 1] || {};
            const firstEvent = events[0] || {};

            // Verileri ekrana yazdır
            resNo.innerText = res.ContainerDetail.ContainerNumber;
            resGemi.innerText = (lastEvent.VesselName || "") + " " + (lastEvent.VoyageNo || "");
            resTesis.innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            resLiman.innerText = res.GeneralTrackingInfo.PortOfDischarge;
            resTur.innerText = res.ContainerDetail.ContainerType;

            // Kartı görünür yap (CSS'de .hidden { display: none; } olmalı)
            resultCard.classList.remove('hidden');
            resultCard.style.display = 'block'; 
        } else {
            alert("Konteyner bulunamadı.");
        }
    } catch (error) {
        console.error("Sorgu hatası:", error);
        alert("Veri çekilemedi. Tarayıcı eklentisi veya Proxy hatası olabilir.");
    }
}
