const { app, BrowserWindow, Menu } = require('electron');

const menu = (isMac, isDev, createAboutWindow) => [
    ...(isMac
        ? [
              {
                  label: app.name,
                  submenu: [
                      {
                          label: 'About',
                          click: createAboutWindow,
                      },
                      { role: 'hide' },
                      { role: 'hideothers' },
                      { role: 'unhide' },
                      { type: 'separator' },
                      { role: 'quit' },
                  ],
              },
          ]
        : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac
        ? [
              {
                  label: 'Help',
                  submenu: [{ label: 'About', click: createAboutWindow }],
              },
          ]
        : []),
    ...(isDev
        ? [
              {
                  label: 'Developer',
                  submenu: [
                      { role: 'reload' },
                      { role: 'forceReload' },
                      { type: 'separator' },
                      { role: 'toggleDevTools' },
                  ],
              },
          ]
        : []),
];

module.exports = { menu };
