async function verileriGetir() {
    const input = document.getElementById('containerInput');
    const no = input.value.trim().toUpperCase();
    const resultCard = document.getElementById('resultCard');

    if (!no) { alert("Lütfen numara girin."); return; }

    // Bu yöntem, veriyi Base64 olarak paketleyip çektiği için 
    // güvenlik duvarlarını (Akamai/Cloudflare) daha kolay aşabilir.
    const targetUrl = `https://www.msc.com/api/feature/vessel-tracking/tracking-results?trackingNumber=${no}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;

    try {
        console.log("Alternatif tünel üzerinden sorgulanıyor...");
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error("Aracı sunucu yanıt vermedi.");

        const wrapper = await response.json();
        
        // Veri 'contents' içinde string olarak gelir
        if (!wrapper.contents) {
            throw new Error("MSC şu an veriyi paylaşmıyor.");
        }

        const data = JSON.parse(wrapper.contents);
        const res = data.TrackingResults ? data.TrackingResults[0] : null;

        if (res) {
            const events = res.Events || [];
            const last = events.length > 0 ? events[events.length - 1] : {};
            
            document.getElementById('res_no').innerText = res.ContainerDetail?.ContainerNumber || no;
            document.getElementById('res_gemi').innerText = `${last.VesselName || ""} ${last.VoyageNo || ""}`.trim() || "Bilgi Yok";
            document.getElementById('res_tesis').innerText = events[0]?.EquipmentHandling?.Name || "Bilgi Yok";
            document.getElementById('res_liman').innerText = res.GeneralTrackingInfo?.PortOfDischarge || "Bilgi Yok";
            document.getElementById('res_tur').innerText = res.ContainerDetail?.ContainerType || "Bilgi Yok";

            resultCard.style.display = "block";
            resultCard.classList.remove('hidden');
        } else {
            alert("Konteyner bulunamadı veya MSC erişimi geçici olarak kapattı.");
        }
    } catch (error) {
        console.error("Hata:", error);
        alert("Erişim Sorunu: MSC şu an tüm aracı servisleri engelliyor. Lütfen 5 dakika sonra mobil veriyi kapatıp açarak (IP değiştirerek) tekrar deneyin.");
    }
}
