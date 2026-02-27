async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { alert("Lütfen numara girin."); return; }

    // Yeni aldığınız URL'yi buraya yapıştırın
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbyyPPBq9pOc9-6w2bsleKhwXsMgNYUvkZHsEIWOlAXWjSk20OIdGdmZ3xqmEVK0Fk1bHA/exec";
    const finalUrl = `${googleScriptUrl}?no=${no}`;

    try {
        // 'redirect: follow' Google Script için hayati önem taşır
        const response = await fetch(finalUrl, {
            method: 'GET',
            redirect: 'follow'
        });

        const data = await response.json();
        
        if (data.error) {
            alert("Hata: " + data.message);
            return;
        }

        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events.length > 0 ? events[events.length - 1] : {};
            
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = (last.VesselName || "") + " " + (last.VoyageNo || "");
            document.getElementById('res_tesis').innerText = events[0]?.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("MSC verisi şu an alınamadı. Lütfen numarayı kontrol edip tekrar deneyin.");
        }
    } catch (error) {
        console.error("Fetch Hatası:", error);
        alert("Bağlantı kurulamadı. Lütfen Google Script URL'sini ve yetkilerini kontrol edin.");
    }
}
