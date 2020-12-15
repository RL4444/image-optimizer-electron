const path = require('path');
const os = require('os');
const { ipcRenderer } = require('electron');
const form = document.getElementById('image-form');
const slider = document.getElementById('slider');
const img = document.getElementById('img');
const dropZoneElement = document.getElementById('drop-zone');
const imgJobSection = document.getElementById('images-job-list');

let SELECTED_IMG;
const imgsToConvert = [];

// TODO: create queue for images to be resized

document.getElementById('output-path').innerText = path.join(os.homedir(), '/Desktop/minified_images');

dropZoneElement.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZoneElement.classList.add('drop-zone--over');
});

['dragleave', 'dragend'].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove('drop-zone--over');
    });
});

dropZoneElement.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

    img.files = e.dataTransfer.files;
    console.log('e.dataTransfer.files ', e.dataTransfer.files);
    for (const f of e.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        updateThumbnail(dropZoneElement, f.path);
    }
    dropZoneElement.classList.remove('drop-zone--over');
});

function updateThumbnail(dropZoneElement, file) {
    // images in wrong format
    if (!file.includes('.png') && !file.includes('.jpeg') && !file.includes('.jpg')) {
        dropZoneElement.style.color = 'tomato';
        dropZoneElement.innerText = 'Invalid file format. Files must be .png .jpg or .jpeg formats only';
        return;
    }
    if (dropZoneElement.querySelector('.drop-zone__prompt')) {
        dropZoneElement.querySelector('.drop-zone__prompt').remove();
    }
    dropZoneElement.innerText = '';
    dropZoneElement.style.backgroundColor = 'black';
    dropZoneElement.style.backgroundImage = `url('file://${file}')`;
}

img.addEventListener('change', (e) => {
    if (dropZoneElement.querySelector('.drop-zone__prompt')) {
        dropZoneElement.querySelector('.drop-zone__prompt').remove();
    }
    // use the file path to update the thumbnail
    const filePath = img.files[0].path;
    e.preventDefault();
    e.stopPropagation();
    dropZoneElement.style.backgroundColor = 'black';
    dropZoneElement.style.backgroundImage = `url('file://${filePath}')`;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const imgPath = img.files[0].path;
    if (!imgPath) return;
    const quality = slider.value;
    ipcRenderer.send('image:minimize', {
        imgPath,
        quality,
    });
    imgPath = null;
});

ipcRenderer.on('image:done', () => {
    dropZoneElement.style.backgroundImage = "url('')";
    dropZoneElement.style.backgroundColor = 'transparent';
    window.alert(`Image resized to ${slider.value}% quality`);
});
