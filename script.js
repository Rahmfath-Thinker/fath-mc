// 1. DATA XBL.IO KAMU
const XBOX_USER_ID = "2535430129313091"; 
const API_KEY = "e9dc08da-ff28-4b6f-b334-ef3e120df6c3"; 
const MINECRAFT_TITLE_ID = "1828326130"; 

async function ambilDataXbox() {
    try {
        // Alamat fetch ini harus lengkap sampai ke title ID agar datanya sinkron
        const respon = await fetch(`https://xbl.io/api/v2/achievements/player/${XBOX_USER_ID}/title/${MINECRAFT_TITLE_ID}`, {
            headers: {
                'X-Authorization': API_KEY,
                'Accept': 'application/json'
            }
        });
        
        if (!respon.ok) throw new Error("Gagal terhubung ke API");
        const data = await respon.json();
        
        // Mengambil data spesifik game Minecraft
        const gameData = data.titles[0]; 
        
        // 2. MENGUBAH TEKS STATISTIK
        document.getElementById('xbox-gamerscore').innerText = gameData.currentGamerscore + " G";
        document.getElementById('xbox-presence').innerText = "Terhubung";

        // 3. MEMBERSIHKAN LOADING & MEMBUAT DAFTAR
        const container = document.getElementById('achievement-container');
        container.innerHTML = ""; 

        gameData.achievements.forEach(achieve => {
            const item = document.createElement('div');
            
            const isUnlocked = achieve.progressState === 'Achieved';
            item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
            
            const iconUrl = achieve.mediaAssets && achieve.mediaAssets[0] ? achieve.mediaAssets[0].url : 'https://minecraft.wiki/images/Invicon_Grass_Block.png';
            
            item.innerHTML = `
                <img src="${iconUrl}" alt="Icon">
                <div class="achieve-details">
                    <h4>${achieve.name}</h4>
                    <p>${achieve.description || 'Achievement rahasia / belum terbuka.'}</p>
                </div>
                <span class="badge">${isUnlocked ? 'Unlocked' : 'Locked'}</span>
            `;
            container.appendChild(item);
        });

    } catch (error) {
        console.error("Error:", error);
        document.getElementById('xbox-gamerscore').innerText = "API Error";
        document.getElementById('xbox-presence').innerText = "Offline";
        document.getElementById('achievement-container').innerHTML = "<p style='color:red; text-align:center;'>Gagal memuat data. Periksa kembali struktur kodenya!</p>";
    }
}

document.addEventListener("DOMContentLoaded", ambilDataXbox);
