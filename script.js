const animeList = document.getElementById('animeList');
const modal = document.getElementById('videoModal');
const player = document.getElementById('videoPlayer');
let currentMalId = "";

// 1. Ambil Data Awal
async function getAnime(url, title = "Populer") {
    document.getElementById('sectionTitle').innerText = title;
    const res = await fetch(url);
    const json = await res.json();
    animeList.innerHTML = "";
    json.data.forEach(anime => {
        const div = document.createElement('div');
        div.className = 'anime-card';
        div.innerHTML = `
            <img src="${anime.images.jpg.image_url}">
            <div class="info"><p>${anime.title}</p></div>
        `;
        div.onclick = () => openWatch(anime.title, anime.mal_id);
        animeList.appendChild(div);
    });
}

// 2. Fungsi Nonton
function openWatch(title, id) {
    currentMalId = id;
    document.getElementById('modalTitle').innerText = title;
    changeServer(1); // Default Server 1
    modal.style.display = "block";
}

// 3. Pindah Server (Solusi jika Not Found)
function changeServer(server) {
    if(server === 1) {
        player.src = `https://vidsrc.me/embed/anime?mal_id=${currentMalId}`;
    } else {
        player.src = `https://vidsrc.xyz/embed/anime/${currentMalId}`;
    }
}

// 4. Tutup & Search
document.querySelector('.close-btn').onclick = () => {
    modal.style.display = "none";
    player.src = "";
};

document.getElementById('searchBtn').onclick = () => {
    const q = document.getElementById('searchInput').value;
    getAnime(`https://api.jikan.moe/v4/anime?q=${q}`, `Hasil: ${q}`);
};

getAnime('https://api.jikan.moe/v4/top/anime');
