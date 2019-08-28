Simple application in **Electron** and **WebcamJS** to take snapshots from camera and persist in disk. 
Application is mainly created for integrating with another ***"Do not Disturb"*** application.
https://digitasecurity.com/donotdisturb/
allowing to make camera snapshots and persist them, when macbook lid is opened.

Application is taking 2 photos (one after 1 sec, another after 5sec) and store in "/Users/MB/Library/Application Support/electron-snapshot/camera/" directory

Example image file: cam_1566946799874.png

# Building and running

```
npm install
npm start
```

for native packages
```
npm run electron-build
```

in "Do Not Disturb" application we can configure "execute action" as:
```
open /Applications/electron-snapshot.app
```
