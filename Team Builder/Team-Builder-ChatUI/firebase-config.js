<<<<<<< Updated upstream
/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  apiKey: "AIzaSyAh6TNZwIs92kWMOCdRHHJdxfcRCl8zue0",
  authDomain: "local-dev-chat.firebaseapp.com",
  projectId: "local-dev-chat",
  storageBucket: "local-dev-chat.appspot.com",
  messagingSenderId: "102203063472",
  appId: "1:102203063472:web:6f2b1467e172988636cf75",
  measurementId: "G-GJTLTZEDVL"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
=======
/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */
const config = {
  apiKey: "AIzaSyAh6TNZwIs92kWMOCdRHHJdxfcRCl8zue0",
  authDomain: "local-dev-chat.firebaseapp.com",
  projectId: "local-dev-chat",
  storageBucket: "local-dev-chat.appspot.com",
  messagingSenderId: "102203063472",
  appId: "1:102203063472:web:6f2b1467e172988636cf75",
  measurementId: "G-GJTLTZEDVL"
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
>>>>>>> Stashed changes
}