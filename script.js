
const apiKey = '46088442-9362140bd756dea21bf87761d';
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const caption = document.getElementById('caption');
const closeModal = document.getElementById('closeModal');
const themeToggle = document.getElementById('themeToggle');
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

// Function to fetch images from Pixabay API
async function fetchImages(query = 'nature') {
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`);
        const data = await response.json();
        displayImages(data.hits);
    } catch (error) {
        console.error('Error fetching images:', error);
        alert('Failed to fetch images. Please try again later.');
    }
}

// Function to display images in the gallery
function displayImages(images) {
    gallery.innerHTML = ''; // Clear previous images
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags;
        img.className = 'gallery-image';
        img.onclick = () => openModal(image);
        gallery.appendChild(img);
    });
}

// Function to open modal with larger image
function openModal(image) {
    modal.style.display = 'block';
    modalImage.src = image.largeImageURL;
    caption.innerHTML = `Title: ${image.tags} <br> Author: ${image.user}`;

    // Clear previous buttons
    const existingButtons = document.querySelector('.modal-buttons');
    if (existingButtons) existingButtons.remove();

    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-buttons'; // Add class for styling
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center'; // Center the buttons
    buttonContainer.style.marginTop = '20px'; // Add some spacing above the buttons

    // Create Download Button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'download-button';
    downloadButton.textContent = 'Download';
    downloadButton.onclick = () => downloadImage(image.largeImageURL);

    // Create Bookmark Button
    const bookmarkButton = document.createElement('button');
    bookmarkButton.className = 'bookmark-button';
    bookmarkButton.textContent = bookmarks.includes(image.largeImageURL) ? 'Unbookmark' : 'Bookmark';
    bookmarkButton.onclick = () => toggleBookmark(image.largeImageURL);

    // Create Share Button
    const shareButton = document.createElement('button');
    shareButton.className = 'share-button';
    shareButton.textContent = 'Share';
    shareButton.onclick = () => shareImage(image.largeImageURL);

    // Append buttons to the container
    buttonContainer.appendChild(downloadButton);
    buttonContainer.appendChild(bookmarkButton);
    buttonContainer.appendChild(shareButton);
    modal.appendChild(buttonContainer); // Append container to modal
}

// Function to download image
function downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to toggle bookmark
function toggleBookmark(url) {
    if (bookmarks.includes(url)) {
        bookmarks = bookmarks.filter(item => item !== url);
    } else {
        bookmarks.push(url);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    alert('Bookmark updated!');
}

// Function to share image
function shareImage(url) {
    if (navigator.share) {
        navigator.share({
            title: 'Check out this image!',
            url: url
        }).then(() => {
            console.log('Image shared successfully!');
        }).catch((error) => {
            console.error('Error sharing image:', error);
            alert('Failed to share the image. Please try again.');
        });
    } else {
        alert('Sharing not supported on this browser. Copy the link: ' + url);
    }
}

// Close modal when clicking on the close button
closeModal.onclick = function() {
    modal.style.display = 'none';
};

// Add event listener for the search button
searchBtn.onclick = function() {
    const query = searchInput.value || 'nature';
    fetchImages(query);
};

// Theme toggle function
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const footer = document.querySelector('footer');
    footer.classList.toggle('dark-mode');
}

// Add event listener for the theme toggle button
themeToggle.onclick = toggleTheme;

// Fetch initial images
fetchImages();

