/**
 * Social System
 * Handles Sidebar navigation, Friend List rendering, and Profile overlays.
 * Wii U / iiSU aesthetic
 */

window.SocialSystem = {
  overlay: null,
  friends: [],
  friendRequests: [],
  globalUsers: [],
  unsubFriends: null,
  unsubRequests: null,

  init() {
    this.overlay = document.getElementById('social-overlay');
  },

  openOverlay(tab) {
    if(!this.overlay) this.init();
    this.overlay.classList.remove('hidden');

    const header = document.getElementById('social-header');
    const leftCol = document.getElementById('social-left-col');
    
    // Play sound
    if (window.AudioManager && AudioManager.playClick) {
      AudioManager.playClick();
    }

    // Reset UI
    this.setFocusMii(null);
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));

    if (tab === 'profile') {
      document.getElementById('btn-my-profile').classList.add('active');
      header.textContent = "Mon Profil";
      leftCol.style.opacity = '1'; 
      
      const currentUser = (window.Auth && Auth.getCurrentUser()) ? Auth.getCurrentUser() : "Guest";
      const currentTag = (window.Auth && Auth.currentUserTag) ? Auth.currentUserTag : "0000";
      
      // Populate Left Column with Account Info
      document.getElementById('social-list').innerHTML = `
        <div class="friend-card active" style="cursor:default; margin-bottom: 20px;">
          <div class="friend-name" style="font-size: 22px;">${currentUser}<span class="friend-tag">#${currentTag}</span></div>
          <div class="friend-gender" style="margin-top:5px; font-size:14px; color:#5f6f82;">Mon Compte Interactif</div>
        </div>
        <div style="padding: 10px 20px; color: #5f6f82; font-weight: 700;">
          <div style="margin-bottom: 15px;">
            <div style="font-size: 11px; text-transform: uppercase; opacity: 0.6;">Localisation</div>
            <div style="font-size: 16px;">France</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div style="font-size: 11px; text-transform: uppercase; opacity: 0.6;">Dernière Connexion</div>
            <div style="font-size: 16px;">En ligne maintenant</div>
          </div>
          <div style="margin-bottom: 15px;">
            <div class="stat-card">
          <div class="stat-label">Status du Compte</div>
          <div class="stat-value" style="color: #6adae4;">Aventurier Plaza</div>
        </div>
        
        <button onclick="window.Auth.logout()" style="margin-top: 20px; padding: 12px; width: 100%; background: #ff6b6b; color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(255,107,107,0.3);">Déconnexion</button>
      </div>
      `;
      
      // Fetch Real Mii
      this.fetchUserMii(currentUser, currentTag);

    } else if (tab === 'friends') {
      document.getElementById('btn-friends').classList.add('active');
      header.textContent = "Liste d'Amis";
      leftCol.style.opacity = '1';
      this.renderAddFriendUI();
      this.fetchRealFriends();

    } else if (tab === 'global') {
      document.getElementById('btn-global').classList.add('active');
      header.textContent = "Découvrir la Plaza";
      leftCol.style.opacity = '1';
      this.fetchGlobalUsers();

    } else if (tab === 'messages') {
      document.getElementById('btn-messages').classList.add('active');
      header.textContent = "Messages";
      leftCol.style.opacity = '1';
      document.getElementById('social-list').innerHTML = '<div style="text-align:center; padding: 40px; opacity:0.6;">Service de messagerie indisponible pour le moment.</div>';
    }
  },

  closeOverlay() {
    if(this.overlay) this.overlay.classList.add('hidden');
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    
    if(this.unsubFriends) this.unsubFriends();
    if(this.unsubRequests) this.unsubRequests();
    
    if (window.AudioManager && AudioManager.playBack) {
      AudioManager.playBack();
    }
  },

  renderAddFriendUI() {
    const list = document.getElementById('social-list');
    list.innerHTML = `
      <div style="padding: 15px; margin-bottom: 20px; background: rgba(0,0,0,0.05); border-radius: 20px;">
        <input type="text" id="friend-search-input" placeholder="Pseudo#1234..." style="width: 100%; padding: 10px; border: none; border-radius: 10px; font-family: inherit;">
        <button onclick="SocialSystem.addFriendRequest()" style="width:100%; margin-top: 10px; padding: 10px; background: #6adae4; color:white; border:none; border-radius: 10px; font-weight: 700; cursor: pointer;">Ajouter</button>
      </div>
      <div id="requests-list-inner" style="margin-bottom: 20px;"></div>
      <div id="friends-list-header" style="font-size: 14px; font-weight: 800; color: #5f6f82; margin-bottom: 10px; padding-left: 10px;">MES AMIS</div>
      <div id="friends-list-inner">Chargement...</div>
    `;
  },

  async fetchRealFriends() {
    const listInner = document.getElementById('friends-list-inner');
    const requestsInner = document.getElementById('requests-list-inner');
    if (!listInner || !requestsInner) return;

    const fbUser = window.Auth ? window.Auth.currentUser : null;
    if (!fbUser) return;

    try {
      // 1. Listen for requests
      const requestsRef = window.Firestore.collection(window.Firestore.db, "users", fbUser.uid, "friend_requests");
      this.unsubRequests = window.Firestore.onSnapshot(requestsRef, (snapshot) => {
        this.friendRequests = [];
        snapshot.forEach(doc => {
          this.friendRequests.push({ id: doc.id, ...doc.data() });
        });
        this.renderRequests(this.friendRequests, requestsInner);
      });

      // 2. Listen for actual friends
      const friendsRef = window.Firestore.collection(window.Firestore.db, "users", fbUser.uid, "friends");
      this.unsubFriends = window.Firestore.onSnapshot(friendsRef, async (snapshot) => {
        const friendsList = [];
        for (const friendDoc of snapshot.docs) {
          const friendUid = friendDoc.id;
          // Fetch full profile to get bio, gender, lastActive, etc.
          try {
            const userRef = window.Firestore.doc(window.Firestore.db, "users", friendUid);
            const userSnap = await window.Firestore.getDoc(userRef);
            if (userSnap.exists()) {
              friendsList.push({ uid: friendUid, ...userSnap.data() });
            } else {
              // Fallback to minimal data if profile fetch fails
              friendsList.push({ uid: friendUid, ...friendDoc.data() });
            }
          } catch(e) { 
            console.error("Social: Error fetching friend profile", e);
            friendsList.push({ uid: friendUid, ...friendDoc.data() });
          }
        }
        this.friends = friendsList;
        this.renderListItems(this.friends, listInner, "Tu n'as pas encore d'amis.");
      });

    } catch (e) { console.error("SocialSystem: Listeners error:", e); }
  },

  renderRequests(data, container) {
    if (data.length === 0) {
      container.innerHTML = '';
      return;
    }
    
    let html = '<div style="font-size: 14px; font-weight: 800; color: #ff6b6b; margin-bottom: 10px; padding-left: 10px;">DEMANDES EN ATTENTE</div>';
    data.forEach(req => {
       html += `
         <div class="friend-card" style="margin-bottom: 10px;">
           <div class="friend-name">${req.username}<span class="friend-tag">#${req.tag}</span></div>
           <div style="display:flex; gap: 8px; margin-top: 10px;">
             <button onclick="SocialSystem.acceptRequest('${req.id}')" style="flex:1; padding: 6px; background: #34c759; color:white; border:none; border-radius: 8px; font-weight: 700; cursor: pointer;">Accepter</button>
             <button onclick="SocialSystem.rejectRequest('${req.id}')" style="flex:1; padding: 6px; background: #ff6b6b; color:white; border:none; border-radius: 8px; font-weight: 700; cursor: pointer;">Refuser</button>
           </div>
         </div>
       `;
    });
    container.innerHTML = html;
  },

  async fetchGlobalUsers() {
    const list = document.getElementById('social-list');
    list.innerHTML = '<div style="text-align:center; padding: 40px;">Recherche d\'utilisateurs...</div>';

    try {
      const usersRef = window.Firestore.collection(window.FirebaseDB, "users");
      const qSnap = await window.Firestore.getDocs(usersRef);
      
      this.globalUsers = [];
      qSnap.forEach(doc => {
          const u = doc.data();
          if (u.username !== Auth.currentUsername) {
            this.globalUsers.push({
              username: u.username,
              tag: u.tag || "0000",
              bio: u.bio || "Explorateur Hylia Plaza",
              gender: u.gender || "Joueur",
              mii: 'public/assets/icons/logov2.webp',
              playtime: u.playtime || "??",
              creation: u.createdAt ? new Date(u.createdAt).getFullYear().toString() : "2024",
              favapp: u.favoriteApp || "Hyl1a App",
              uid: doc.id
            });
          }
      });

      this.renderList(this.globalUsers);
    } catch(e) { 
      console.error("SocialSystem: Global fetch error:", e); 
      list.innerHTML = `
        <div style="text-align:center; padding: 40px; color: #5f6f82;">
          <div style="font-size: 40px; margin-bottom: 10px;">🛡️</div>
          <div>Accès restreint</div>
          <div style="font-size: 11px; opacity: 0.7; margin-top: 10px;">La liste globale nécessite des permissions administratives.</div>
        </div>
      `;
    }
  },

  renderList(data) {
    const list = document.getElementById('social-list');
    // If it's global, we might not have the add friend UI
    if (document.getElementById('friends-list-inner')) {
       const inner = document.getElementById('friends-list-inner');
       inner.innerHTML = '';
       this.renderListItems(data, inner);
    } else {
       list.innerHTML = '';
       this.renderListItems(data, list, "Aucune information trouvée.", true);
    }
  },

  renderListItems(data, container, emptyMsg = "Aucune information trouvée.", showAddButton = false) {
    container.innerHTML = '';
    if (data.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding: 20px; opacity:0.6;">'+emptyMsg+'</div>';
      return;
    }

    data.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'friend-card';
      if(index === 0) card.classList.add('active'); 
      
      let addButtonHtml = '';
      if (showAddButton) {
        addButtonHtml = `<button onclick="event.stopPropagation(); SocialSystem.addFriendRequest('${item.username}#${item.tag}')" style="margin-top: 8px; width: 100%; padding: 4px; background: rgba(0,0,0,0.1); border: none; border-radius: 6px; font-weight: bold; cursor: pointer; color: #333;">+ Ajouter</button>`;
      }

      const isOnline = item.lastActive ? (Date.now() - new Date(item.lastActive).getTime() < 300000) : false; // 5 mins
      const statusClass = isOnline ? 'online' : 'offline';

      card.innerHTML = `
        <div class="friend-status-dot ${statusClass}"></div>
        <div class="friend-name">${item.username}<span class="friend-tag">#${item.tag}</span></div>
        <div class="friend-bio-small">${item.bio}</div>
        <div class="friend-gender">${item.gender}</div>
        ${addButtonHtml}
      `;

      card.addEventListener('mouseenter', () => {
         document.querySelectorAll('.friend-card').forEach(c => c.classList.remove('active'));
         card.classList.add('active');
         this.setFocusMii(item);
         if(window.AudioManager && AudioManager.playHover) AudioManager.playHover();
      });

      container.appendChild(card);
    });

    if(data.length > 0) this.setFocusMii(data[0]);
  },

  async addFriendRequest(targetId) {
    const input = document.getElementById('friend-search-input');
    let target = input ? input.value.trim() : targetId;
    
    if (!target) return;
    
    const fbUser = window.Auth ? window.Auth.currentUser : null;
    if (!fbUser) return;
    
    const parts = target.split('#');
    if(parts.length !== 2) {
      alert("Format invalide. Utilise Pseudo#1234");
      return;
    }
    
    const [targetUsername, targetTag] = parts;
    const currentUsername = window.Auth.currentUsername;
    const currentTag = window.Auth.currentUserTag || "0000";
    
    if (targetUsername === currentUsername && targetTag === currentTag) {
       alert("Tu ne peux pas t'ajouter toi-même !");
       return;
    }
    
    try {
       // Search for user
       const usersRef = window.Firestore.collection(window.Firestore.db, "users");
       const q = window.Firestore.query(usersRef, window.Firestore.where("username", "==", targetUsername), window.Firestore.where("tag", "==", targetTag));
       const qSnap = await window.Firestore.getDocs(q);
       
       if (qSnap.empty) {
         alert("Utilisateur introuvable. Vérifie le pseudo et le tag.");
         return;
       }
       
       const targetDoc = qSnap.docs[0];
       const targetUid = targetDoc.id;
       
       // Send request
       const requestRef = window.Firestore.doc(window.Firestore.db, "users", targetUid, "friend_requests", fbUser.uid);
       await window.Firestore.setDoc(requestRef, {
         username: currentUsername,
         tag: currentTag,
         status: 'pending',
         timestamp: new Date().toISOString()
       });
       
       alert("Demande d'ami envoyée à " + target + " !");
       if(input) input.value = "";
    } catch(e) {
       console.error(e);
       alert("Erreur lors de l'envoi de la demande. Tes règles Firestore le bloquent peut-être.");
    }
  },
  
  async acceptRequest(senderUid) {
     const fbUser = window.Auth ? window.Auth.currentUser : null;
     if(!fbUser) return;
     
     const req = this.friendRequests.find(r => r.id === senderUid);
     if(!req) return;
     
     try {
       // Add to my friends
       const myFriendRef = window.Firestore.doc(window.Firestore.db, "users", fbUser.uid, "friends", senderUid);
       await window.Firestore.setDoc(myFriendRef, {
         username: req.username,
         tag: req.tag,
         timestamp: new Date().toISOString()
       });
       
       // Add me to their friends
       const theirFriendRef = window.Firestore.doc(window.Firestore.db, "users", senderUid, "friends", fbUser.uid);
       await window.Firestore.setDoc(theirFriendRef, {
         username: window.Auth.currentUsername,
         tag: window.Auth.currentUserTag || "0000",
         timestamp: new Date().toISOString()
       });
       
       // Delete request
       await this.rejectRequest(senderUid);
       alert("Ami ajouté avec succès !");
     } catch(e) {
       console.error("Accept error", e);
       alert("Action bloquée par Firestore.");
     }
  },
  
  async rejectRequest(senderUid) {
     const fbUser = window.Auth ? window.Auth.currentUser : null;
     if(!fbUser) return;
     try {
       const reqRef = window.Firestore.doc(window.Firestore.db, "users", fbUser.uid, "friend_requests", senderUid);
       await window.Firestore.deleteDoc(reqRef);
     } catch(e) {
       console.error("Reject error", e);
     }
  },

  setFocusMii(friend) {
    const imgObj = document.getElementById('social-focus-mii');
    if(!imgObj) return;
    
    if(!friend) {
      imgObj.style.opacity = '0';
      return;
    }

    imgObj.style.opacity = '0'; 
    imgObj.style.transform = 'scale(0.95)';
    
    setTimeout(async () => {
      const nameEl = document.getElementById('stat-display-name');
      if (nameEl) nameEl.innerHTML = `${friend.username}<span style="opacity:0.6; font-size:0.7em;">#${friend.tag}</span>`;
      
      const bioEl = document.getElementById('stat-bio');
      if (bioEl) bioEl.textContent = friend.bio || "Explorateur Hylia Plaza";
      
      const genEl = document.getElementById('stat-gender');
      if (genEl) genEl.textContent = friend.gender || "Joueur";
      
      const ptEl = document.getElementById('stat-playtime');
      if (ptEl) ptEl.textContent = friend.playtime || "??";
      
      const crEl = document.getElementById('stat-creation');
      if (crEl) crEl.textContent = friend.creation || "2024";
      
      const favEl = document.getElementById('stat-favapp');
      if (favEl) favEl.textContent = friend.favapp || "Hylia Plaza";
      
      // Try to fetch Mii if not present
      let displayB64 = friend.b64;
      if (!displayB64 && friend.uid) {
         try {
           const avatarRef = window.Firestore.doc(window.Firestore.db, "avatars", friend.uid);
           const avatarSnap = await window.Firestore.getDoc(avatarRef);
           if (avatarSnap.exists()) {
              displayB64 = avatarSnap.data().visual_base64;
           }
         } catch(e) { console.error("SocialSystem: Error fetching friend mii", e); }
      }

      // Render as full body for the focus zone
      if (displayB64) {
         imgObj.src = `https://mii-unsecure.ariankordi.net/miis/image.png?data=${encodeURIComponent(displayB64)}&verifyCharInfo=0&type=all_body&width=512&shaderType=wiiu`;
      } else {
         imgObj.src = 'public/assets/icons/mii.webp'; // Default Mii instead of logo
      }
      
      imgObj.onload = () => {
         imgObj.style.opacity = '1';
         imgObj.style.transform = 'scale(1)';
      };
    }, 150);
  },

  async fetchUserMii(username, tag) {
    const fbUser = window.Auth ? window.Auth.currentUser : null;
    if (!fbUser) return;

    try {
      if (!window.Firestore || !window.Firestore.getDoc) return;
      const docRef = window.Firestore.doc(window.FirebaseDB, "avatars", fbUser.uid);
      const docSnap = await window.Firestore.getDoc(docRef);

      if (docSnap.exists()) {
        const myAvatar = docSnap.data();
        if (myAvatar && myAvatar.visual_base64) {
          const b64 = myAvatar.visual_base64;
          this.setFocusMii({
            username: username,
            tag: tag,
            bio: "Bienvenue sur mon profil Hylia Plaza ! Je personnalise mon univers.",
            gender: "Utilisateur",
            playtime: "12h",
            creation: myAvatar.createdAt ? new Date(myAvatar.createdAt).getFullYear().toString() : "2024",
            favapp: "Hyl1a Bio",
            b64: b64
          });
          return;
        }
      }
    } catch(e) { console.error("SocialSystem: Error fetching user Mii:", e); }

    // Fallback if no Mii or error
    this.setFocusMii({
      username: username,
      tag: tag,
      bio: "Aucun personnage Mii trouvé pour ce compte.",
      gender: "--",
      playtime: "0h",
      creation: "--",
      favapp: "--",
      mii: 'public/assets/icons/logov2.webp'
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.SocialSystem) window.SocialSystem.init();
});
