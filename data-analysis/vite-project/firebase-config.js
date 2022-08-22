import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyClz8_9nwl6l5ReK4c44h_ajsDxYuf_VTw",
  authDomain: "three-js-demo-58da4.firebaseapp.com",
  projectId: "three-js-demo-58da4",
  storageBucket: "three-js-demo-58da4.appspot.com",
  messagingSenderId: "273050549481",
  appId: "1:273050549481:web:c54af289a4a30ea7cb4478"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const colRef = collection(db, 'coordinateData');

export { colRef };
