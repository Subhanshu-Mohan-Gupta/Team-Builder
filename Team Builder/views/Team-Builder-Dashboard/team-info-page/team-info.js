import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';

import {
    getFirestore,
    collection,
    where,
    doc,
    query,
    onSnapshot,
  } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

  import { getFirebaseConfig } from '/views/firebase-config.js';



  /**
   * handles
   */
  var leaderElement = document.getElementById("leader");
  var memberListElement = document.getElementById("members");
  var descriptionElement = document.getElementById("description");
  var teamNameElement = document.getElementById("team_name");

  async function loadTeams() {
    const urlparm = new URLSearchParams(window.location.search);
    const doc_id = urlparm.get("docid");

 
    const docref = doc(getFirestore(), 'teams', doc_id);


     try{
         const getdoc = onSnapshot(
             docref, (docu) => {
                 var data = docu.data();
               
                leaderElement.textContent = data.leader;
                var team_name = data.team_name;
                teamNameElement.textContent =  data.team_name;
                var idea_id = data.idea_id;     
              

        //getting description
    const descriptionRef = doc(getFirestore(), 'ideas', idea_id);
    
    const desc = onSnapshot(
      descriptionRef, (description) => {
        var descr = description.data();
      
        descriptionElement.textContent = descr.description;
        
      }
    )
                

      //querry for members
  const recentMemberQuery = query(collection(getFirestore(), 'users'), where("team", "==", team_name));
  // Start listening to the query.
  onSnapshot(recentMemberQuery, function(snapshot) {
  
    snapshot.docChanges().forEach(function(change) {

      
      if (change.type === 'removed') {
  
      } else {
        var member = change.doc.data();

        
        createAndInsertMember(member.username);
      }
    });
  });

             } )
     }
     catch(e) {
         console.log(e);
     }

  }


  function createAndInsertMember(name){
  
    const container = document.createElement('li');
  
    memberListElement.appendChild(container)

    container.textContent=name;
  }





  const firebaseApp = initializeApp(getFirebaseConfig());
  loadTeams();