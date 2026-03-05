const animeList = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('videoModal');
const player = document.getElementById('videoPlayer');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close-btn');

// 1. Ambil Data Trending Saat Load Halaman
async function fetchTrending() {
    try {
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=24');
        const data = await response.json();
        renderAnime(data.data);
    } catch (err) {
        animeList.innerHTML = `<p>Gagal memuat data. Periksa koneksi internet.</p>`;
    }
}

// 2. Fungsi Menampilkan Kartu Anime
function renderAnime(animes) {
    animeList.innerHTML = "";
    if (animes.length === 0) {
        animeList.innerHTML = "<p>Anime tidak ditemukan.</p>";
        return;
    }
    animes.forEach(anime => {
        const card = document.createElement('div');
        card.className = 'anime-card';
        card.innerHTML = `
            <div class="rating"><i class="fas fa-star"></i> ${anime.score || 'N/A'}</div>
            <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}" loading="lazy">
            <div class="info">
                <p title="${anime.title}">${anime.title}</p>
            </div>
        `;
        // Gunakan ID MyAnimeList (mal_id) untuk link video
        card.onclick = () => playVideo(anime.title, anime.mal_id);
        animeList.appendChild(card);
    });
}

// 3. Fungsi Pencarian
async function searchAnime() {
    const query = searchInput.value.trim();
    if (query.length < 3) return;

    document.getElementById('sectionTitle').innerText = `Hasil Pencarian: ${query}`;
    animeList.innerHTML = "<p>Sedang mencari...</p>";
    
    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=24`);
        const data = await response.json();
        renderAnime(data.data);
    } catch (err) {
        console.error("Gagal mencari anime:", err);
    }
}

// 4. Fungsi Player Video
function playVideo(title, id) {
    modalTitle.innerText = "Menonton: " + title;
    // Menggunakan provider Vidsrc (Akurat dengan ID)
    player.src = `https://vidsrc.to/embed/anime/${id}`;
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Kunci scroll layar saat nonton
}

// 5. Fungsi Tutup Modal
closeBtn.onclick = () => {
    modal.style.display = "none";
    player.src = ""; // Stop video
    document.body.style.overflow = "auto";
};

// Event Listeners
searchBtn.onclick = searchAnime;
searchInput.onkeypress = (e) => { if (e.key === "Enter") searchAnime(); };
window.onclick = (e) => { if (e.target == modal) closeBtn.onclick(); };

// Jalankan saat pertama kali buka
fetchTrending();
