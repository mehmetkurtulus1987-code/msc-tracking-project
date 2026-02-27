async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { alert("Lütfen numara girin."); return; }

    // YENİ ALDIĞINIZ Google Script URL'sini buraya yapıştırın
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxqtfXJYVn1UqTdGK7YuY6IeaN0vecRFGlFOI9lf0kgG1SvG82pP3tr19c9ETWoIbv9pw/exec";
    const finalUrl = `${googleScriptUrl}?no=${no}`;

    try {
        // 'mode: cors' ve 'redirect: follow' Google Script için kritiktir
        const response = await fetch(finalUrl, {
            method: 'GET',
            mode: 'cors',
            redirect: 'follow'
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }

        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events[events.length - 1] || {};
            
            document.getElementById('res_no').innerText = res.ContainerDetail.ContainerNumber;
            document.getElementById('res_gemi').innerText = (last.VesselName || "") + " " + (last.VoyageNo || "");
            document.getElementById('res_tesis').innerText = events[0]?.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo.PortOfDischarge;
            document.getElementById('res_tur').innerText = res.ContainerDetail.ContainerType;

            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Kayıt bulunamadı. MSC sisteminde veri henüz oluşmamış olabilir.");
        }
    } catch (error) {
        console.error("Detaylı Hata:", error);
        alert("Bağlantı Hatası: Google Script erişim sağlayamadı. URL'yi ve 'Anyone' yetkisini kontrol edin.");
    }
}
