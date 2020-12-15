const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const os = require('os');
const log = require('electron-log');
const slash = require('slash');

// image resizing packages
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const menuComp = require('./components/menu');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const isMac = process.platform === 'darwin' ? true : false;

const menu = menuComp.menu(isMac, isDev, createAboutWindow);

if (isDev) console.log('in dev mode');

let mainWindow;
let aboutWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 600,
        title: 'Image Resizer',
        icon: '🔮', // point to '${__dirname}/assets/icons/<filename>' for custom icon
        resizable: isDev,
        backgroundColor: '#fff',
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadFile('./app/index.html');
}
function createAboutWindow() {
    aboutWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title: 'Image Resizer',
        icon: '🔮', // point to '${__dirname}/assets/icons/<filename>' for custom icon
        resizable: false,
        backgroundColor: '#fff',
    });
    aboutWindow.loadFile('./app/about.html');
}

app.on('ready', () => {
    createMainWindow();

    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => (mainWindow = null));
});

ipcMain.on('image:minimize', (e, options) => {
    options.dest = path.join(os.homedir(), '/Desktop/minified_images');
    shrinkImage(options);
    console.log('options ', options);
});

ipcMain.on('chooseFile', (event, arg) => {
    const result = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }],
    });

    result.then(({ canceled, filePaths, bookmarks }) => {
        const base64 = fs.readFileSync(filePaths[0]).toString('base64');
        event.reply('chosenFile', base64);
    });
});

async function shrinkImage({ imgPath, quality, dest }) {
    try {
        console.log('trying to shrink');
        const pngQuality = quality / 100;
        const files = await imagemin([slash(imgPath)], {
            destination: dest,
            plugins: [imageminMozjpeg({ quality }), imageminPngquant({ quality: [pngQuality, pngQuality] })],
        });
        shell.openPath(dest);

        mainWindow.webContents.send('image:done');
        log.info(`${imgPath} was resized successfully`);
    } catch (error) {
        console.log('error: ', error);
        log.error(imgPath, ' had a problem: ', error);
    }
}

// standard boilerplate code for mac not closing app when hitting x button
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

// if there are no open windows and a user clicks the desktop icon
// this will create a new window by default
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// removes future deprecation console warning for this method
app.allowRendererProcessReuse = true;
