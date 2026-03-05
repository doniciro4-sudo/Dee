const animeListDiv = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');

// 1. Fungsi Ambil Anime Populer (Saat Pertama Buka)
async function getTrendingAnime() {
    try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=20');
        const data = await res.json();
        displayAnime(data.data);
    } catch (err) {
        console.error("Gagal mengambil data:", err);
    }
}

// 2. Fungsi Menampilkan Kartu Anime ke HTML
function displayAnime(animes) {
    animeListDiv.innerHTML = "";
    animes.forEach(anime => {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        card.innerHTML = `
            <div class="rating"><i class="fas fa-star"></i> ${anime.score || 'N/A'}</div>
            <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
            <div class="info">
                <p>${anime.title.length > 20 ? anime.title.substring(0, 20) + "..." : anime.title}</p>
            </div>
        `;
        // Klik untuk nonton (Kita pakai search name sebagai trigger streaming)
        card.onclick = () => openPlayer(anime.title);
        animeListDiv.appendChild(card);
    });
}

// 3. Fungsi Cari Anime
async function searchAnime() {
    const query = searchInput.value;
    if(query.length < 3) return;
    
    animeListDiv.innerHTML = "<p>Mencari...</p>";
    const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=20`);
    const data = await res.json();
    displayAnime(data.data);
}

// 4. Fungsi Buka Player Video (Gunakan Embed Link)
function openPlayer(title) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const mTitle = document.getElementById('modalTitle');
    
    mTitle.innerText = "Menonton: " + title;
    
    // Kita gunakan pihak ketiga untuk streaming (Contoh: mencari di gogoanime embed)
    // Catatan: Ini adalah link simulasi, biasanya kamu butuh Consumet API untuk link asli.
    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    player.src = `https://www.2embed.to/embed/anime/${slug}-episode-1`; 
    
    modal.style.display = "block";
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    modal.style.display = "none";
    player.src = ""; // Stop video saat ditutup
}

// Jalankan saat web dibuka
getTrendingAnime();
