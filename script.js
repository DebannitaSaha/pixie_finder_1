// script.js

const apiKey = '46088442-9362140bd756dea21bf87761d';
const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const caption = document.getElementById('caption');
const closeModal = document.getElementById('closeModal');

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

// Fetch initial images
fetchImages();
