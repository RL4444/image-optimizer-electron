const path = require('path');
const os = require('os');
const { ipcRenderer } = require('electron');
const form = document.getElementById('image-form');
const slider = document.getElementById('slider');
const img = document.getElementById('img');
const dropZoneElement = document.getElementById('drop-zone');
const imgJobSection = document.getElementById('images-job-queue');

let MUST_CONFIRM_QUALITY = false;
let IMG_PATH;
let QUEUE_ID = 1;
let SELECTED_IMG;
let imgsToConvert = [];

// TODO: create queue for images to be resized

document.getElementById('output-path').innerText = path.join(os.homedir(), '/Desktop/minified_images');

async function addNode(imgPath, name, quality) {
    MUST_CONFIRM_QUALITY = false;

    // we need unique ids to remove nodes successfully
    QUEUE_ID += 1;
    const row = document.createElement('div');
    const title = document.createElement('p');
    const deleteButton = document.createElement('p');
    const qualityCount = document.createElement('p');

    // add the significant data to the row
    const rowData = { imgPath, quality, id: `delete-id-${QUEUE_ID}` };
    imgsToConvert.push(rowData);

    row.id = `queue-row-${QUEUE_ID}`;
    row.classList.add('image-job-row');
    row.rowId = QUEUE_ID;

    deleteButton.id = row.appendChild(title);
    // title.innerText = imgPath[0].name;
    title.innerText = name;
    title.classList.add('image-job-row_title');
    const sliderEl = createSliderInput(QUEUE_ID);
    row.appendChild(sliderEl);
    row.appendChild(qualityCount);
    qualityCount.id = `quality-id-${QUEUE_ID}`;
    qualityCount.innerText = `Size: ${quality}%`;
    qualityCount.classList.add('image-job-row_quality');
    row.appendChild(deleteButton);
    deleteButton.innerText = '✖';
    deleteButton.id = `delete-id-${QUEUE_ID}`;
    deleteButton.classList.add('image-job-row_delete');

    deleteButton.addEventListener('click', (e) => {
        removeRow(row, e.target.id);
    });

    imgJobSection.appendChild(row);
}

function createSliderInput(id) {
    const sliderEl = document.createElement('input');

    sliderEl.type = 'range';
    sliderEl.min = '0';
    sliderEl.max = '100';
    sliderEl.id = `slider-${id}`;
    sliderEl.classList.add('image-job-row_quality');

    sliderEl.addEventListener('change', (e) => {
        imgsToConvert.map((row) => {
            if (row.id === `delete-id-${id}`) {
                row.value = e.target.value;
                const qualityDisplay = document.getElementById(`quality-id-${id}`);
                qualityDisplay.innerText = `Size: ${e.target.value}%`;
            }
        });
    });

    return sliderEl;
}

function removeRow(row, dataId) {
    row.classList.add('deleted');
    imgsToConvert.filter((r) => r.id !== dataId);
}

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
    MUST_CONFIRM_QUALITY = true;

    e.preventDefault();
    e.stopPropagation();

    img.files = e.dataTransfer.files;
    IMG_PATH = e.dataTransfer.files;
    for (const f of e.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        updateThumbnail(dropZoneElement, f.path);
        addNode(IMG_PATH[0].path, f.name, '50');
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
    MUST_CONFIRM_QUALITY = true;

    if (dropZoneElement.querySelector('.drop-zone__prompt')) {
        dropZoneElement.querySelector('.drop-zone__prompt').remove();
    }
    const filePath = img.files[0].path;
    IMG_PATH = img.files[0].path;
    e.preventDefault();
    e.stopPropagation();
    dropZoneElement.style.backgroundColor = 'black';
    dropZoneElement.style.backgroundImage = `url('file://${filePath}')`;
    addNode(IMG_PATH, img.files[0].name, '50');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (imgsToConvert.length === 0) return;
    for (var i = 0; i < imgsToConvert.length; i++) {
        ipcRenderer.send('image:minimize', {
            imgPath: imgsToConvert[i].imgPath,
            quality: imgsToConvert[i].quality,
        });
    }
});

ipcRenderer.on('image:done', () => {
    dropZoneElement.style.backgroundImage = "url('')";
    dropZoneElement.style.backgroundColor = 'transparent';
    imgsToConvert = [];
    document.querySelectorAll('.image-job-row').forEach((el) => {
        el.classList.add('deleted');
    });
    dropZoneElement.innerText = 'Done!';
});
