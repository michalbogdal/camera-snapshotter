const electron = require("electron");

const { app, BrowserWindow, ipcMain } = electron;
const fs = require("fs");

const NUM_OF_EXPECED_IMAGES = 2;

let mainWindow;
let imagesCounter = 0;

app.on("ready", _ => {
  mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    skipTaskbar: true,
    toolbar: false
  });
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadURL(`file://${__dirname}/screen.html`);

  mainWindow.on("close", _ => {
    mainWindow = null;
  });
});

ipcMain.on("capturedImage", (event, imageBuffer) => {
  const dir = `${app.getPath("appData")}/${app.getName()}/camera`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const fileName = `${dir}/cam_${new Date().getTime()}.png`;
  imagesCounter = imagesCounter + 1;
  fs.writeFile(fileName, imageBuffer.data, function(err) {
    if (err) {
      console.log("Cannot save the file :'( time to cry !" + err);
    } else {
      console.log(`Image saved succesfully [${fileName}]`);
    }
  });

  if (imagesCounter >= NUM_OF_EXPECED_IMAGES) {
    app.quit();
  }
});
