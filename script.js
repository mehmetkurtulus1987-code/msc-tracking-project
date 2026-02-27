async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) {
        alert("Lütfen bir numara girin.");
        return;
    }

    console.log("Alternatif sorgu metodu başlatıldı...");

    // AllOrigins kullanarak veriyi ham metin (contents) olarak alıyoruz.
    // Bu yöntem tarayıcıdaki CORS engelini aşmak için en etkili yoldur.
    const target = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(target)}&callback=?`;

    try {
        // fetch yerine JSONP benzeri bir yapı kullanarak engeli deliyoruz
        const response = await fetch(url);
        if (!response.ok) throw new Error("Bağlantı sağlanamadı.");
        
        const data = await response.json();
        
        // AllOrigins veriyi 'contents' içine string olarak koyar. Bunu JSON'a geri çeviriyoruz.
        const mscData = JSON.parse(data.contents);
        const res = mscData.TrackingResults ? mscData.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events.length > 0 ? events[events.length - 1] : {};
            const first = events.length > 0 ? events[0] : {};

            // HTML elementlerini doldur
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${last.VesselName || "Bilgi Yok"} ${last.VoyageNo || ""}`.trim();
            document.getElementById('res_tesis').innerText = first.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Sonucu göster
            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
            console.log("Veri başarıyla işlendi.");
        } else {
            alert("Konteyner bulunamadı. Lütfen numarayı kontrol edin.");
        }

    } catch (error) {
        console.error("Sistem Hatası:", error);
        alert("Bağlantı engellendi. Bu durum genellikle MSC'nin güvenlik sisteminden kaynaklanır.\n\nLütfen tarayıcınızda 'Allow CORS' eklentisinin AÇIK olduğundan emin olun.");
    }
}
