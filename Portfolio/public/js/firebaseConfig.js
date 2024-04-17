const firebaseConfig = {
    apiKey: "AIzaSyA4_4-fMoDm319cqfeNF64KwjYh3mDn5Qo",
    authDomain: "portfoliowebsite-f2dd1.firebaseapp.com",
    projectId: "portfoliowebsite-f2dd1",
    storageBucket: "portfoliowebsite-f2dd1.appspot.com",
    messagingSenderId: "208317401030",
    appId: "1:208317401030:web:22de31f4f51263e49a14c7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Initialize Firebase Storage only when needed
let storage;
function getStorage() {
    if (!storage) {
        storage = firebase.storage();
    }
    return storage;
}
