

const { app, BrowserWindow, Menu } = require('electron');
const path =  require('node:path');



const createWindow = () => {
    const win = new BrowserWindow({
      width: 400,
      height: 800,
      minWidth: 400,
      minHeight:800,
      maxWidth:400,
      maxHeight:800,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    win.loadFile('index.html')
  }

/*   if (process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname,{
      electron: path.join(__dirname, './node_modules', '.bin', 'electron')
    })

  }
 */
  app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
      })

      const mainMenu = Menu.buildFromTemplate(templateMenu);
      Menu.setApplicationMenu(mainMenu);
  });



  const templateMenu = [
    {
      label: 'File',
      submenu:[
        {
          label: "New Checklist",
          accelerator: process.platform == 'darwin' ? 'command+N' : 'Ctrl+N',
          click(){
            createWindow();
          }
        },
        {
          type: 'separator'
        },
        {
          label: "Exit",
          accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
          click(){
            app.quit();
          }
        }
      ]
    }
  ]

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  if(process.platform === 'darwin'){
    templateMenu.unshift({
      label: app.getName()
    })
  }


  if (process.env.NODE_ENV !== 'production'){
    templateMenu.push({
      label: 'Devtools',
      submenu:[
        {
          label: 'Show/Hide Dev Tools',
          click(item, focusedWindow){
            focusedWindow.toggleDevTools();
          }
        },
        {
          role: 'reload'
        }
      ]
    })
  }
  