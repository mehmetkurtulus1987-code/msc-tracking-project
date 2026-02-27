async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { 
        alert("Lütfen numara girin."); 
        return; 
    }

    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyxKtvvx5p8f5wTseD04AEz8D-D8v-5WLFGogNlFn8nHBYWYYzYq20U8EcFrmHhUlk/exec";
    const finalUrl = `${googleScriptUrl}?no=${no}`;

    try {
        // 'redirect: follow' Google Script için olmazsa olmazdır
        const response = await fetch(finalUrl, {
            method: 'GET',
            redirect: 'follow' 
        });
        
        // Google bazen HTML dönebilir, önce metin olarak alıp sonra JSON'a çevirmek daha güvenlidir
        const rawData = await response.text();
        const data = JSON.parse(rawData);
        
        if (data.error) {
            throw new Error(data.error);
        }

        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events.length > 0 ? events[events.length - 1] : {};
            const first = events.length > 0 ? events[0] : {};

            // HTML ID'lerinizle eşleştirme
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = (last.VesselName || "") + " " + (last.VoyageNo || "");
            document.getElementById('res_tesis').innerText = first.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Sonucu göster
            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Kayıt bulunamadı. Lütfen numarayı kontrol edin.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Veri işlenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.");
    }
}
