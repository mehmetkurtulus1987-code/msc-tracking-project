async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { 
        alert("Lütfen numara girin."); 
        return; 
    }

    // Google Apps Script URL'niz
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbx_xji9sVQzgioXAq9kQJ9bC3DHoLQa49QR6m8K9NRa_ToYDooWaGAaS34mNzDsUE5ohg/exec";
    
    // Google Script'e 'no' parametresi ile istek atıyoruz
    const finalUrl = `${googleScriptUrl}?no=${no}`;

    console.log("Sorgu Google Sunucuları üzerinden iletiliyor...");

    try {
        const response = await fetch(finalUrl);
        
        if (!response.ok) throw new Error("Google Script yanıt vermedi.");

        const data = await response.json();
        
        // Veri yapısını kontrol ediyoruz
        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events.length > 0 ? events[events.length - 1] : {};
            const first = events.length > 0 ? events[0] : {};

            // HTML elementlerini doldurma
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = (last.VesselName || "") + " " + (last.VoyageNo || "");
            document.getElementById('res_tesis').innerText = first.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Sonuç kartını göster
            resultCard.style.display = "block";
            if(resultCard.classList.contains('hidden')) {
                resultCard.classList.remove('hidden');
            }
            
            console.log("Veri başarıyla çekildi.");
        } else {
            alert("Kayıt bulunamadı. Lütfen numarayı kontrol edin.");
        }
    } catch (error) {
        console.error("Hata detayı:", error);
        alert("Bağlantı hatası: Google Script erişimi reddedildi veya MSC veriyi göndermedi.");
    }
}
