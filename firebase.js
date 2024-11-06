// NEW firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNTxref6U4uZ-yQkNuchu4Fg-DpdJOxHE",
  authDomain: "superhuman-003.firebaseapp.com",
  databaseURL: "https://superhuman-003-default-rtdb.firebaseio.com",
  projectId: "superhuman-003",
  storageBucket: "superhuman-003.firebasestorage.app",
  messagingSenderId: "565004741890",
  appId: "1:565004741890:web:d90e84b795cde394b4661b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const downloadCountRef = ref(database, 'downloadCount');
const downloadUrlRef = ref(database, 'currentDownloadUrl');

// Generate or retrieve a unique ID for the user
const userId = localStorage.getItem('uniqueUserId') || `user_${Date.now()}${Math.random().toString(36).slice(2, 15)}`;
localStorage.setItem('uniqueUserId', userId);

// Get initial download count and display it
get(downloadCountRef).then(snapshot => {
  document.getElementById('downloadCounter').textContent = snapshot.val() || 0;
}).catch(console.error);

// Set up a listener for the download link click
document.getElementById('downloadLink').addEventListener('click', () => {
  get(ref(database, `userDownloads/${userId}`)).then(snapshot => {
    const hasDownloaded = snapshot.exists();
    Promise.all([get(downloadCountRef), get(downloadUrlRef)]).then(([countSnapshot, urlSnapshot]) => {
      const downloadCount = countSnapshot.val();
      const downloadUrl = urlSnapshot.val();

      if (downloadCount > 0 && downloadUrl) {
        if (!hasDownloaded) {
          set(downloadCountRef, downloadCount - 1).then(() => {
            update(ref(database, 'userDownloads'), { [userId]: true });
            document.getElementById('downloadCounter').textContent = downloadCount - 1;
            window.location.href = downloadUrl;
          }).catch(console.error);
        } else {
          window.location.href = downloadUrl;
        }
      } else {
        alert(downloadUrl ? "Download Cap Reached – Stay Tuned for More" : "Download link unavailable. Please try again later.");
      }
    }).catch(console.error);
  }).catch(console.error);
});
