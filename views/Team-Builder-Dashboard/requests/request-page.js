import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';

import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
  } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

import { getFirebaseConfig } from '/views/firebase-config.js';


var RequestElement = document.querySelector(".request_container");

async function loadReq(){

   const serch = new URLSearchParams(window.location.search);
   var my_user = serch.get("user");
  

    var qerry = query(collection(getFirestore(), "requests"), where("receiver", "==", my_user), where("status", "==", "pending"));


   onSnapshot(qerry, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        //////
      } else {
        displayRequest(change.doc.id,change.doc.data().sender,change.doc.data().receiver,change.doc.data().idea_id);
        console.log(change.doc.data())
       }
    });
  });
}

function displayRequest(id, name,receiver, idea_id){
  var div = document.getElementById(id) || createRequest(id);

   div.querySelector(".user").textContent = name;
   var req = div.querySelector("#accept");
   req.setAttribute("sender",name); 
   req.setAttribute("receiver",receiver);
   req.setAttribute("docid",id);
   req.setAttribute("idea_id",idea_id);

   //for decline function
   var req = div.querySelector("#decline");
   req.setAttribute("sender",name); 
   req.setAttribute("receiver",receiver);
   req.setAttribute("docid",id);
   req.setAttribute("idea_id",idea_id);


  }

  var TEMPLATE = '<div class="request">'+
   '<div class="user"></div>'+
   '<div id="accept" onclick="accept(this.getAttribute(`sender`), this.getAttribute(`receiver`), this.getAttribute(`docid`), this.getAttribute(`idea_id`))">'+
   'Accept</div>'+
   '<div id="decline" onclick="decline(this.getAttribute(`sender`), this.getAttribute(`receiver`), this.getAttribute(`docid`), this.getAttribute(`idea_id`))">'+
   'Decline</div>'+
  '</div>'+
  '</div>';

function createRequest(id){
  const container = document.createElement('div');
  
  container.innerHTML = TEMPLATE;
  
  const div = container.firstChild;
  div.setAttribute('id', id);
  const existingMessages = RequestElement.children;
  if (existingMessages.length === 0) {
    RequestElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[existingMessages.length-1];


    RequestElement.insertBefore(div, messageListNode);
  }
  
  return div;
}

//accept function
 window.accept = async function(sender, receiver, docid, idea_id) {
 
 if(window.confirm("Do you really want to accept the request?   \n sender: "+sender+
 "  receiver: "+receiver+"  docid: "+docid
 )) {


  /**
   * checking whether 
   * sender already has
   * any team or not
   */
  const snap = await getDoc(doc(getFirestore(), "users", receiver));
 if(snap.data().team){
   window.alert(receiver+" is already in a team : "+snap.data().team);
 }
 else {


  var team_name = window.prompt("Please Enter your team Name. ", "Team name...");
     
  if(team_name!=null && !/\s/.test(team_name)){
    try {


      /**
       * getting data of
       * idea from
       * idea id
       */
 
       const idea = await getDoc(doc(getFirestore(), "ideas", idea_id));
       var project_idea = idea.data().title;
       var team_logo_url = idea.data().imgurl;
      
      /**
       * adding team in database
       * in teams collection
       * as well as in individual 
       * team members
       */
      await addDoc(collection(getFirestore(), "teams"), {
        team_logo_url:team_logo_url,
        project_idea:project_idea,
        leader: receiver,
        docid: docid,
        team_name: team_name,
        idea_id: idea_id
      });
  
  
       //updating request as accepted in firebase
       await updateDoc(doc(getFirestore(), "requests", docid) , {
        "status": "accepted"
      })
  
  
      /**
       * adding team to both 
       * sender and receiver
       */
      //sender
       await updateDoc(doc(getFirestore(), "users", sender) , {
        team: team_name
      })
      //receiver
      await updateDoc(doc(getFirestore(), "users", receiver) , {
        team: team_name
      })
      
      
    }
    catch(e){
       console.log(e);
    }
  }
  else {
    window.alert("invalid team name");
  }
 }

}
}



//decline request
window.decline = async function(sender, receiver, reqid, idea_id) {
  
  if(window.confirm("Do You really want to delete this request?")){
  
     //updating request as rejected in firebase
     await updateDoc(doc(getFirestore(), "requests", reqid) , {
      "status": "rejected"
    })
  }

}







  const firebaseApp = initializeApp(getFirebaseConfig());
   loadReq();