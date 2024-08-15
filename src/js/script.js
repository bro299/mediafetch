// JavaScript untuk fungsi paste dan download
document.getElementById('pasteBtn').addEventListener('click', () => {
    navigator.clipboard.readText().then(text => {
        document.getElementById('urlInput').value = text;
    }).catch(err => {
        alert('Gagal membaca isi clipboard: ' + err);
    });
});

async function fetchData() {
    const urlInput = document.getElementById('urlInput').value.trim();
const content = document.getElementById('content');
const spinner = document.getElementById('spinner');

    content.innerHTML = ''; // Clear previous content
    spinner.style.display = 'block'; // Show spinner

    if (!urlInput) {
        content.innerHTML = '<p class="text-red-500 font-semibold">Please enter a valid URL.</p>';
        spinner.style.display = 'none'; // Hide spinner
        return; }
content.innerHTML = ''; // Clear previous content

if (!urlInput) {
content.innerHTML = '<p class="text-red-500 font-semibold">Please enter a valid URL.</p>';
return;
}
        // Api
let apiUrl;
if (urlInput.includes('tiktok.com')) {
apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(urlInput)}`;
} else if (urlInput.includes('spotify.com')) {
apiUrl = `https://itzpire.com/download/spotify?url=${encodeURIComponent(urlInput)}`;
} else if (urlInput.includes('instagram.com')) {
if (urlInput.includes('/reel/') || urlInput.includes('/p/')) {
    apiUrl = `https://api.nyxs.pw/dl/ig?url=${encodeURIComponent(urlInput)}`;
} else {
    content.innerHTML = '<p class="text-red-500 font-semibold">Invalid Instagram URL. Please enter a valid Instagram reel or post URL.</p>';
    return;
}
} else if (urlInput.includes('facebook.com')) {
apiUrl = `https://api.nyxs.pw/dl/fb?url=${encodeURIComponent(urlInput)}`;
} else if (urlInput.includes('twitter.com') || urlInput.includes('x.com')) {
apiUrl = `https://itzpire.com/download/twitter?url=${encodeURIComponent(urlInput)}`;
} else {
content.innerHTML = '<p class="text-red-500 font-semibold">Invalid URL. Please enter a TikTok, Spotify, Instagram, Facebook, or Twitter URL.</p>';
return;
}

try {
const response = await fetch(apiUrl);
const data = await response.json();

// Fetch Data Tiktok
if (urlInput.includes('tiktok.com')) {
    if (data.id) {
        const { title, created_at, stats, video, music, author, images } = data;
        content.innerHTML = `
            <div class="card mb-4">
                <div class="card-custom">
                    <img src="${author.avatar}" alt="Author Avatar" class="small-avatar rounded-circle mr-3 responsive-img">
                    <span class="font-bold">${author.name} (@${author.unique_id})</span>
                </div>
                <div class="mb-4">
                    <p class="font-semibold text-lg">${title}</p>
                    <p class="text-sm text-gray-500">Created on: ${created_at}</p>
                </div>
                <div id="media-content"></div>
                <div class="flex justify-between text-center mb-4">
                    <div>
                        <span>👍</span><br>
                        ${stats.likeCount} Likes
                    </div>
                    <div>
                        <span>💬</span><br>
                        ${stats.commentCount} Comments
                    </div>
                    <div>
                        <span>🔗</span><br>
                        ${stats.shareCount} Shares
                    </div>
                    <div>
                        <span>🎧</span><br>
                        ${stats.playCount} Plays
                    </div>
                </div>
                <div class="text-center">
                    ${video ? `<a href="${video.noWatermark}" download class="btn btn-primary-custom">Download Video</a> |` : ''}
                    ${music ? `<a href="${music.play_url}" download class="btn btn-primary-custom">Download Music</a>` : ''}
                </div>
            </div>
        `;

        const mediaContent = document.getElementById('media-content');
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                const imageElement = document.createElement('div');
                imageElement.className = 'mb-4';
                imageElement.innerHTML = `
                    <img src="${image.url}" alt="TikTok Image ${index + 1}" class="responsive-img rounded-lg mb-2">
                    <a href="${image.url}" download class="btn btn-primary-custom">Download Image ${index + 1}</a>
                `;
                mediaContent.appendChild(imageElement);
            });
        } else if (video) {
            mediaContent.innerHTML = `
                <div class="mb-4">
                    <video controls src="${video.noWatermark}" class="responsive-video rounded-lg"></video>
                </div>
            `;
        }
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Failed to fetch TikTok data.</p>';
    }
}
// Fetch Data Spotify
else if (urlInput.includes('spotify.com')) {
    if (data.status === 'success') {
        const { title, artist, image, download } = data.data;
        content.innerHTML = `
            <div class="card mb-4">
                <img src="${image}" alt="Song Image" class="responsive-img rounded-lg mb-2">
                <p class="font-semibold text-lg">${title}</p>
                <p class="text-sm text-gray-500">Artist: ${artist}</p>
                <div class="text-center">
                    <a href="${download}" download class="btn btn-primary-custom">Download Music</a>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Failed to fetch Spotify data.</p>';
    }
}
// Fetch data Instagram
else if (urlInput.includes('instagram.com')) {
    if (data.result) {
        const { result } = data;
        if (urlInput.includes('/reel/')) {
            if (result.length > 0) {
                const reel = result[0];
                content.innerHTML = `
                    <video controls src="${reel.url}" class="responsive-video rounded-lg"></video>
                    <div class="text-center mt-4">
                        <a href="${reel.url}" download class="btn btn-primary-custom">Download Reel</a>
                    </div>
                `;
            } else {
                content.innerHTML = '<p class="text-red-500">No reels found.</p>';
            }
        } else if (urlInput.includes('/p/')) {
            if (result.length > 0) {
                result.forEach(image => {
                    content.innerHTML += `
                        <img src="${image.url}" alt="Instagram Post Image" class="responsive-img rounded-lg mb-4">
                        <div class="text-center">
                            <a href="${image.url}" download class="btn btn-primary-custom">Download Image</a>
                        </div>
                    `;
                });
            } else {
                content.innerHTML = '<p class="text-red-500">No images found.</p>';
            }
        }
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Failed to fetch Instagram data.</p>';
    }
}
// Fetch Data Facebook
else if (urlInput.includes('facebook.com')) {
    if (data.status === 'true' && data.result) {
        const { hd, sd } = data.result;
        content.innerHTML = `
            <div class="card mb-4">
                <video controls src="${hd}" class="responsive-video rounded-lg mb-2"></video>
                <div class="text-center">
                    <a href="${hd}" download class="btn btn-primary-custom">Download HD Video</a> | 
                    <a href="${sd}" download class="btn btn-primary-custom">Download SD Video</a>
                </div>
            </div>
        `;
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Failed to fetch Facebook data.</p>';
    }
}
// Fetch Data Twitter
else if (urlInput.includes('twitter.com') || urlInput.includes('x.com')) {
    if (data.status === 'success') {
        const { desc, thumb, video_sd, video_hd, audio } = data.data;
        content.innerHTML = `
            <div class="card mb-4">
                <img src="${thumb}" alt="Thumbnail" class="responsive-img rounded-lg mb-2">
                <p class="font-semibold text-lg">${desc}</p>
                <div class="text-center mt-4">
                    ${video_hd ? `<a href="${video_hd}" download class="btn btn-primary-custom">Download HD Video</a> |` : ''}
                    ${video_sd ? `<a href="${video_sd}" download class="btn btn-primary-custom">Download SD Video</a> |` : ''}
                    ${audio ? `<a href="${audio}" download class="btn btn-primary-custom">Download Audio</a>` : ''}
                </div>
            </div>
        `;
    } else {
        content.innerHTML = '<p class="text-red-500 font-semibold">Failed to fetch Twitter data.</p>';
    }
}
} catch (error) {
console.error(error);
content.innerHTML = '<p class="text-red-500 font-semibold">An error occurred while fetching data.</p>';
}
finally {
        spinner.style.display = 'none'; // Hide spinner
    }
}

// Dark Mode Toggle
const toggleButton = document.getElementById('darkModeToggle');
toggleButton.addEventListener('click', toggleDarkMode);

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');

    const darkModeEnabled = body.classList.contains('dark-mode');
    localStorage.setItem('darkModeEnabled', darkModeEnabled);

    const icon = toggleButton.querySelector('i');
    if (darkModeEnabled) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function loadDarkModeFromLocalStorage() {
    const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        const icon = toggleButton.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

loadDarkModeFromLocalStorage();

// Language Change Function
function changeLanguage(lang) {
    // Fungsi untuk mengubah bahasa berdasarkan pilihan dropdown
    if (lang === 'en') {
        document.querySelector('h1').textContent = 'Download Videos, Music & Images Effortlessly';
        document.querySelector('p').textContent = 'Enter the URL below to get started!';
        document.querySelector('input').placeholder = 'Enter URL here...';
        document.getElementById('pasteBtn').innerHTML = '<i class="fas fa-paste"></i> Paste';
        document.getElementById('downloadBtn').textContent = 'Download';
        document.querySelector('.nav-link[href="#"]').textContent = 'Home';
        document.querySelector('.nav-link[href="#"]:nth-of-type(2)').textContent = 'About';
        document.querySelector('.nav-link[href="#"]:nth-of-type(3)').textContent = 'Contact';
        document.querySelector('.navbar-brand').textContent = 'MediaFetch';
        document.querySelector('footer p').textContent = '© 2024 MediaFetch. All rights reserved.';
    } else if (lang === 'es') {
        document.querySelector('h1').textContent = 'Descargar Videos, Música e Imágenes Sin Esfuerzo';
        document.querySelector('p').textContent = '¡Ingresa la URL a continuación para comenzar!';
        document.querySelector('input').placeholder = 'Ingrese la URL aquí...';
        document.getElementById('pasteBtn').innerHTML = '<i class="fas fa-paste"></i> Pegar';
        document.getElementById('downloadBtn').textContent = 'Descargar';
        document.querySelector('.nav-link[href="#"]').textContent = 'Inicio';
        document.querySelector('.nav-link[href="#"]:nth-of-type(2)').textContent = 'Acerca de';
        document.querySelector('.nav-link[href="#"]:nth-of-type(3)').textContent = 'Contacto';
        document.querySelector('.navbar-brand').textContent = 'MediaFetch';
        document.querySelector('footer p').textContent = '© 2024 MediaFetch. Todos los derechos reservados.';
    } else if (lang === 'jv') {
        document.querySelector('h1').textContent = 'Download Video, Musik & Gambar Kanthi Gampang';
        document.querySelector('p').textContent = 'Lebokno URL ing ngisor iki kanggo miwiti!';
        document.querySelector('input').placeholder = 'Lebokno URL ing kene...';
        document.getElementById('pasteBtn').innerHTML = '<i class="fas fa-paste"></i> Tèmpèl';
        document.getElementById('downloadBtn').textContent = 'Download';
        document.querySelector('.nav-link[href="#"]').textContent = 'Beranda';
        document.querySelector('.nav-link[href="#"]:nth-of-type(2)').textContent = 'Kira-kira';
        document.querySelector('.nav-link[href="#"]:nth-of-type(3)').textContent = 'Hubungi';
        document.querySelector('.navbar-brand').textContent = 'MediaFetch';
        document.querySelector('footer p').textContent = '© 2024 MediaFetch. Hak cipta dilindungi.';
    } else {
        document.querySelector('h1').textContent = 'Unduh Video, Musik & Gambar dengan Mudah';
        document.querySelector('p').textContent = 'Masukkan URL di bawah ini untuk memulai!';
        document.querySelector('input').placeholder = 'Masukkan URL di sini...';
        document.getElementById('pasteBtn').innerHTML = '<i class="fas fa-paste"></i> Tempel';
        document.getElementById('downloadBtn').textContent = 'Unduh';
        document.querySelector('.nav-link[href="#"]').textContent = 'Beranda';
        document.querySelector('.nav-link[href="#"]:nth-of-type(2)').textContent = 'Tentang';
        document.querySelector('.nav-link[href="#"]:nth-of-type(3)').textContent = 'Kontak';
        document.querySelector('.navbar-brand').textContent = 'MediaFetch';
        document.querySelector('footer p').textContent = '© 2024 MediaFetch. Hak cipta dilindungi undang-undang.';
    }
}