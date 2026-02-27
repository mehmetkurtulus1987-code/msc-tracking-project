async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { 
        alert("Lütfen numara girin."); 
        return; 
    }

    // Yeni aldığın Google Script URL'sini buraya tam yapıştır
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxCiptnnc0ZgzrJaRWnKCWfOlfA845QOHb6vPQDzwGcWnMTDdvxewYgxTRHPnt6YRZOCQ/exec";
    
    const finalUrl = `${googleScriptUrl}?no=${no}`;

    try {
        // redirect: 'follow' ekleyerek Google'ın yönlendirmesini takip ediyoruz
        const response = await fetch(finalUrl, { redirect: 'follow' });
        
        if (!response.ok) throw new Error("Google sunucusu yanıt vermedi.");

        const data = await response.json();
        
        if (data.error) {
            throw new Error("Google Script Hatası: " + data.error);
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
            alert("Kayıt bulunamadı. Numaranın doğruluğunu MSC sitesinden teyit edin.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Sorgulama başarısız. Google Script erişim iznini (Anyone) kontrol edin.");
    }
}
