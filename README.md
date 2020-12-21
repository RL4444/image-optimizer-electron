# Web Image Optimizer

This is a project using a drag and drop interface for optimizing web images (png, jpg, jpeg) on a users local machine. This project was build using electron.js and a few plugins for handling the image compression.

## Getting Started in Dev Mode

firstly install the packages using `yarn` or `npm`

`yarn` or `npm install`

once the dependencies are installed, you can run the project using one of two `package.json` scripts

with node and no hot-reload

`npm run start`

or with hot reload using nodemon - 1

`npm run dev`

1 - personally I find the hot reload annoying to use when developing. Any slight changes to any of the frontend js files or `main.js` will result in the whole app closing and relaunching.

The project should be good to go in dev mode after these steps.

## Bundling an Application in the ./release-builds directory (I have added this dir to the .gitignore for less bloat)

Christian Engvall gives a create short summary of how to build the executables for Mac, Linux and Windows at

https://www.christianengvall.se/electron-packager-tutorial/

### To build a Mac OS app

In your project root run this in your bash terminal

` electron-packager . --overwrite --platform=darwin --arch=x64 --icon=assets/icons/mac/icon.icns --prune=true --out=release-builds`

### To build a Windows .exe

In your project root run this in your gitbash terminal

` electron-packager . web-image-optimizer --overwrite --asar=true --platform=win32 --arch=ia32 --icon=assets/icons/win/icon.ico --prune=true --out=release-builds --version-string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="Web Image Optimizer"`

### To build a Linux executable

In your project root run this in your bash terminal

` electron-packager . web-image-optimizer --overwrite --asar=true --platform=linux --arch=x64 --icon=assets/icons/png/1024x1024.png --prune=true --out=release-builds`

As suggested in Christian's tutorial I have also added theses scripts to the package.json, so you can simply run:

`npm run package-mac`

or

`npm run package-win`

or

`npm run package-linux`

## Creating a .dmg && .exe installation file

### creating a .dmg

In your project root run this in your bash terminal

`electron-installer-dmg ./release-builds/Web\\ Image\\ Optimizer-darwin-x64/Web\\ Image\\ Optimizer.app web-image-optimizer --out=release-builds --overwrite --icon=app/icons/mac/icon.icns`

or `npm run create-installer-mac`

### creating a windows .exe

This setup requires a few different steps than creating a .dmg. The scripts needed create an executable stored in the `/installers` directory and will handle the build.

You can create a .exe by running

`npm run create-installer-win`
