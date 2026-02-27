async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    // HTML elementlerini temizle ve hazırla
    if (!no) {
        alert("Lütfen bir konteyner numarası girin.");
        return;
    }

    console.log(`${no} numarası için sorgu başlatıldı...`);

    // Doğrudan bağlantı adresi
    const url = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Yanıt başarılı değilse (Örn: 403 Forbidden) hataya fırlat
        if (!response.ok) {
            throw new Error(`Sunucu yanıtı: ${response.status}`);
        }

        const data = await response.json();
        
        // Verinin varlığını kontrol et
        if (data.TrackingResults && data.TrackingResults.length > 0) {
            const res = data.TrackingResults[0];
            const events = res.Events || [];
            
            // Verileri eşleştirirken boş kalma ihtimaline karşı kontrol ekleyelim
            const lastEvent = events.length > 0 ? events[events.length - 1] : {};
            const firstEvent = events.length > 0 ? events[0] : {};

            // DOM Güncelleme
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${lastEvent.VesselName || "Bilgi Yok"} ${lastEvent.VoyageNo || ""}`.trim();
            document.getElementById('res_tesis').innerText = firstEvent.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            // Sonuç kartını göster
            resultCard.style.display = "block";
            resultCard.classList.remove('hidden'); 
        } else {
            alert("Bu numara ile eşleşen bir kayıt bulunamadı.");
        }
    } catch (error) {
        console.error("Detaylı Hata:", error);
        
        // Kullanıcıya daha net bir çözüm sunalım
        if (error.message.includes("Failed to fetch") || error.message.includes("Sunucu yanıtı: 403")) {
            alert("ERİŞİM ENGELİ: MSC sunucusu doğrudan bağlantıyı reddetti.\n\nÇözüm:\n1. Tarayıcınıza 'Allow CORS' eklentisini kurun.\n2. Eklentiyi aktif (ON) hale getirin.\n3. Sayfayı yenileyip tekrar deneyin.");
        } else {
            alert("Bir hata oluştu: " + error.message);
        }
    }
}
