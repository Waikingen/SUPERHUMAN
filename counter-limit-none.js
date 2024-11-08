// Counter No Limit
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

// Get initial download count and display it
get(downloadCountRef).then(snapshot => {
  document.getElementById('downloadCounter').textContent = snapshot.val() || 0;
}).catch(console.error);

// Set up a listener for the download link click
document.getElementById('downloadLink').addEventListener('click', () => {
  Promise.all([get(downloadCountRef), get(downloadUrlRef)]).then(([countSnapshot, urlSnapshot]) => {
    const downloadCount = countSnapshot.val();
    const downloadUrl = urlSnapshot.val();

    if (downloadCount > 0 && downloadUrl) {
      set(downloadCountRef, downloadCount - 1).then(() => {
        document.getElementById('downloadCounter').textContent = downloadCount - 1;
        window.location.href = downloadUrl;
      }).catch(console.error);
    } else {
      alert(downloadUrl ? "Download Cap Reached – Stay Tuned for More" : "Download link unavailable. Please try again later.");
    }
  }).catch(console.error);
});
