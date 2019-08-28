**Camera Snapshotter**

Simple application in **Electron** and **WebcamJS** to take snapshots from camera and persist in disk. 
Application is mainly created for integrating with another ***"Do not Disturb"*** application.
https://digitasecurity.com/donotdisturb/
allowing to make camera snapshots and persist them, when macbook lid is opened.

Application is taking 2 photos (one after 1 sec, another after 5sec) and store in defined directory, which by default could be */Users/michalbogdal/Library/Application Support/camera-snapshotter/camera*

Example image file: cam_1566946799874.png

# Configuration
If application is executed with parameter "-config" we will see window where we can change default path for persisted images.

```
npm run start-config
```
or native mac app
```
open camera-snapshotter.app --args -config
```

All settings are stored using ***electron-settings*** module which persist config in */Users/michalbogdal/Library/Application Support/camera-snapshotter/Settings*

# Building and running

```
npm install
npm start
npm run start-config
```

for native packages
```
npm run electron-build
```

in "Do Not Disturb" application we can configure "execute action" as:
```
open /Applications/camera-snapshotter.app
```
