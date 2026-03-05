const animeListDiv = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');

// 1. Ambil Anime Trending saat web dibuka
async function getTrendingAnime() {
    try {
        const res = await fetch('https://api.jikan.moe/v4/top/anime?limit=24');
        const data = await res.json();
        displayAnime(data.data);
    } catch (err) {
        animeListDiv.innerHTML = "<p style='color:white;'>Gagal memuat data. Coba refresh halaman.</p>";
    }
}

// 2. Fungsi Menampilkan Kartu Anime
function displayAnime(animes) {
    animeListDiv.innerHTML = "";
    animes.forEach(anime => {
        const card = document.createElement('div');
        card.classList.add('anime-card');
        card.innerHTML = `
            <div class="rating"><i class="fas fa-star"></i> ${anime.score || 'N/A'}</div>
            <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" loading="lazy">
            <div class="info">
                <p>${anime.title.length > 25 ? anime.title.substring(0, 25) + "..." : anime.title}</p>
            </div>
        `;
        // Klik untuk nonton berdasarkan ID MyAnimeList agar akurat
        card.onclick = () => openPlayer(anime.title, anime.mal_id);
        animeListDiv.appendChild(card);
    });
}

// 3. Fungsi Cari Anime
async function searchAnime() {
    const query = searchInput.value.trim();
    if (query.length < 3) return;
    
    animeListDiv.innerHTML = "<p style='color:white;'>Mencari anime...</p>";
    try {
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=24`);
        const data = await res.json();
        displayAnime(data.data);
    } catch (err) {
        console.error("Error saat cari:", err);
    }
}

// 4. Buka Player Video (Ganti ke Vidsrc yang lebih stabil)
function openPlayer(title, id) {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    const mTitle = document.getElementById('modalTitle');
    
    mTitle.innerText = "Nonton: " + title;
    
    // Link ini lebih sakti karena pakai ID resmi MyAnimeList
    player.src = `https://vidsrc.to/embed/anime/${id}`; 
    
    modal.style.display = "block";
}

// 5. Tutup Modal
function closeModal() {
    const modal = document.getElementById('videoModal');
    const player = document.getElementById('videoPlayer');
    modal.style.display = "none";
    player.src = ""; 
}

// Event Enter untuk Search
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchAnime();
});

getTrendingAnime();
