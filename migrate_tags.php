<?php
/**
 * One-off migration script to assign tags to existing users.
 */
?>
<!DOCTYPE html>
<html>
<head>
    <title>Hylia Plaza - Tag Migration</title>
    <style>
        body { font-family: sans-serif; padding: 40px; background: #f0f4f8; }
        #log { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-height: 500px; overflow-y: auto; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>User Tag Migration</h1>
    <div id="status">Initializing Firebase...</div>
    <div id="log"></div>

    <!-- Firebase SDK -->
    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
        import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAcOQ4GAfxvOJWmfbe9SXA63_WNAqUBMzE",
            authDomain: "hyl1a-plaza.firebaseapp.com",
            projectId: "hyl1a-plaza",
            storageBucket: "hyl1a-plaza.firebasestorage.app",
            messagingSenderId: "74246669403",
            appId: "1:74246669403:web:0a7d62be23c73823fbeb7e"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const log = document.getElementById('log');

        function addLog(msg, type = '') {
            const div = document.createElement('div');
            div.className = type;
            div.textContent = `> ${msg}`;
            log.appendChild(div);
            log.scrollTop = log.scrollHeight;
        }

        async function migrate() {
            addLog("Starting migration...");
            try {
                const usersRef = collection(db, "users");
                const qSnap = await getDocs(usersRef);
                
                let updatedCount = 0;
                let skippedCount = 0;
                const existingTags = new Set();
                
                // First pass: collect existing tags
                qSnap.forEach(doc => {
                    const data = doc.data();
                    if (data.tag) existingTags.add(data.tag);
                });

                addLog(`Found ${qSnap.size} users. Processing...`);

                for (const userDoc of qSnap.docs) {
                    const data = userDoc.data();
                    if (!data.tag) {
                        let newTag;
                        do {
                            newTag = Math.floor(1000 + Math.random() * 9000).toString();
                        } while (existingTags.has(newTag));
                        
                        existingTags.add(newTag);
                        await updateDoc(doc(db, "users", userDoc.id), { tag: newTag });
                        addLog(`Updated ${data.username || userDoc.id} with tag #${newTag}`, 'success');
                        updatedCount++;
                    } else {
                        skippedCount++;
                    }
                }

                addLog("Migration Complete!", 'success');
                addLog(`Updated: ${updatedCount}, Already had tags: ${skippedCount}`);
                document.getElementById('status').textContent = "Migration Finished.";
            } catch (e) {
                addLog(`Error: ${e.message}`, 'error');
                console.error(e);
            }
        }

        migrate();
    </script>
</body>
</html>
