Simple Electron app to take photos from camera (webcamjs). 
Application is created mainly for integrating with "Do not Disturb" application.

We will take 2 photos (one after 1 sec, another after 5sec) and store in "/Users/MB/Library/Application Support/electron-screenshot/camera/" directory

Example image file: cam_1566946799874.png

# Building and running

```
npm start
```

for native packages
```
npm run electron-build
```

in "Do Not Disturb" application we can then use 
```
open /Applications/electron-snapshot.app
```
