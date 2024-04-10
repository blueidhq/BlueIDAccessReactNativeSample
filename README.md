# BlueID Access React Native Sample App

This is a sample app that demonstrate the basic usage of BlueID's Access React Native SDK

For more information check our [documentation](https://community.blue-id.com/documentation)

## Getting Started

### Installation

Install NPM packages
   ```sh
   npm install
   ```
   
### Running the app on iOS
To be able to run the app on an iOS device, first you need to install the pods, to do so run `pod install` inside the `/ios` folder

Once pods are installed run:
   ```sh
   npm run start
   ```

Then on the terminal type "i" when prompted to run the app on your iOS device.

**Important:** To be able to run on a **real device** you'll need to select a developer team on XCode. To change the team open `/ios/BlueIDAccessRNSample.xcworkspace` with XCode and change it on the *Signing & Capabilities* tab.
 
### Running the app on Android
To run the app on an Android device simply run the following command:
   ```sh
   npm run start
   ```
Then on the terminal type "a" when prompted to run the app on your Android device.
