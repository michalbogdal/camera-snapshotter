const electron = require("electron");
const settings = require("electron-settings");
const fs = require("fs");

const { app, dialog, BrowserWindow, ipcMain } = electron;

const DEFAULT_CONFIG = {
  imagesDir: `${app.getPath("appData")}/${app.getName()}/camera`,
  numOfImages: 2
};

let mainWindow;
let imagesCounter = 0;
let configurationMode = false;

checkAndSetConfigurationMode = () => {
  if (process.argv.filter(arg => arg === "-config").length > 0) {
    configurationMode = true;
  }
  console.log(`config mode:${configurationMode}`);
};

app.on("ready", _ => {
  settings.set("userConfig", settings.get("userConfig") || DEFAULT_CONFIG);
  checkAndSetConfigurationMode();

  mainWindow = new BrowserWindow({
    width: configurationMode ? 600 : 0,
    height: configurationMode ? 500 : 0,
    skipTaskbar: true,
    toolbar: false,
    show: false
  });
  mainWindow.setMenu(null);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(`file://${__dirname}/screen.html`);

  mainWindow.on("close", _ => {
    mainWindow = null;
    app.quit();
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
});

sendConfiguration = imagesDir => {
  mainWindow.webContents.send("config", {
    imagesDir: imagesDir
  });
};

checkDirectoryAndShowError = (path, onSuccess) => {
  if (path) {
    fs.access(path, fs.R_OK && fs.W_OK, function(err) {
      if (err) {
        dialog.showErrorBox(
          "Error with selected path",
          "Cannot select this folder, probably you dont have access to it."
        );
        console.log("cannot use selected path. Error: " + err);
      } else {
        onSuccess(path);
      }
    });
  }
};

ipcMain.on("selectNewImagesPath", (event, currentPath) => {
  let options = {
    defaultPath: currentPath,
    properties: ["openDirectory"]
  };
  dialog.showOpenDialog(options, path => {
    if (path) {
      checkDirectoryAndShowError(path[0], path => sendConfiguration(path));
    }
  });
});

ipcMain.on("selectDefaultImagesPath", event => {
  sendConfiguration(DEFAULT_CONFIG.imagesDir);
});

ipcMain.on("saveImagesPath", (event, imagesPath) => {
  checkDirectoryAndShowError(imagesPath, path => {
    settings.set("userConfig.imagesDir", path);
    const options = {
      type: "info",
      title: "Success",
      message: "Path to images updated successfully."
    };
    dialog.showMessageBox(null, options);
  });
});

ipcMain.on("fetchConfig", event => {
  sendConfiguration(settings.get("userConfig").imagesDir);
});

ipcMain.on("capturedImage", (event, imageBuffer) => {
  if (!configurationMode) {
    const dir = settings.get("userConfig").imagesDir;
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

    if (imagesCounter >= settings.get("userConfig").numOfImages) {
      console.log(`Expected num of images taken... quit`);
      mainWindow = null;
      app.quit();
    }
  }
});
