
## About
Classic messaging app. Created with React Native, Node.js with Express.js framework, MongoDB, and Socket.io for private messaging. Users can find friends by searching via name or email and send them a friend request. Once connected, users are able to message each other with a modern UI design. Image uploads via Cloudinary

## instructions for developers
adb kill-server && adb start-server in terminal to start ADB

open android studio and start emulator

in client terminal, npx react-native start --host 127.0.0.1 to start metro bundler

in client terminal, npx react-native run-android --variant=debug --deviceId emulator-5554 to run android emulator

in server terminal, run npm start to start backend server

make sure ip address is accurate x.x