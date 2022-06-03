const {app, BrowserWindow} = require('electron');
const path = require('path');

let win = null;

const isDev = !app.isPackaged;
function createWindow(){
  win = new BrowserWindow({
    width:1000,
    height:700,
    backgroundColor: '#ffffff',
    webPreferences: {
      //浏览器的js支持node
      nodeIntegration: true,
      contextIsolation: false,
      worldSafeExecuteJavaScript: true,
    }
  })
  win.loadFile('./index.html').catch(console.error);
  win.webContents.openDevTools();
}
if(isDev){
  require('electron-reload')(__dirname,{
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

app.whenReady().then(()=>{
  createWindow();
});