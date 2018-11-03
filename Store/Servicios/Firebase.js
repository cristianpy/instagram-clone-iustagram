import * as firebase from 'firebase';

const config = {
  apiKey: 'AIzaSyANaTRalDIg6xkYxN1dT1DtvvZKI2sMXGk',
  authDomain: 'clon-instagram-b7466.firebaseapp.com',
  databaseURL: 'https://clon-instagram-b7466.firebaseio.com',
  projectId: 'clon-instagram-b7466',
  storageBucket: '',
  messagingSenderId: '270173526659',
};
firebase.initializeApp(config);

export const autenticacion = firebase.auth();
export const baseDeDatos = firebase.database();
