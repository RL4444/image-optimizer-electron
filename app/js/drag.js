// document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
//     const dropZoneElement = inputElement.closest('.drop-zone');

//     dropZoneElement.addEventListener('dragover', (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         dropZoneElement.classList.add('drop-zone--over');
//     });

//     ['dragleave', 'dragend'].forEach((type) => {
//         dropZoneElement.addEventListener(type, (e) => {
//             dropZoneElement.classList.remove('drop-zone--over');
//         });
//     });

//     dropZoneElement.addEventListener('drop', (e) => {
//         e.preventDefault();
//         e.stopPropagation();

//         for (const f of e.dataTransfer.files) {
//             // Using the path attribute to get absolute file path
//             console.log('File Path of dragged files: ', f.path);
//             updateThumbnail(dropZoneElement, f.path);
//         }
//         dropZoneElement.classList.remove('drop-zone--over');
//     });
// });

// function updateThumbnail(dropZoneElement, file) {
//     // images in wrong format
//     if (!file.includes('.png') && !file.includes('.jpeg') && !file.includes('.jpg')) {
//         dropZoneElement.style.color = 'tomato';
//         dropZoneElement.innerText = 'Invalid file format. Files must be .png .jpg or .jpeg formats only';
//         return;
//     }
//     if (dropZoneElement.querySelector('.drop-zone__prompt')) {
//         dropZoneElement.querySelector('.drop-zone__prompt').remove();
//     }
//     dropZoneElement.style.backgroundColor = 'black';
//     dropZoneElement.style.backgroundImage = `url('file://${file}')`;
// }
