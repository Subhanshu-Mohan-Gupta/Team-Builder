
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';

import {
    getFirestore,
    doc,
    getDoc,
  } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

  import { getFirebaseConfig } from '/views/firebase-config.js';


  /**
   * getting element 
   * handles
   */
  var description_Element = document.getElementById("description");
  var img_elemetn = document.getElementById("img");
  var title_element = document.getElementById("title");


 async function loadIdea() {
    const urlparm = new URLSearchParams(window.location.search);
    const doc_id = urlparm.get("docid");
    
 
    const docref = doc(getFirestore(), 'ideas', doc_id);
    const docSnap = await getDoc(docref);
    
    if(docSnap.exists()) {
          var data = docSnap.data();
          description_Element.textContent= data.description;
          img_elemetn.setAttribute("src",data.imgurl);
          title_element.textContent = data.title;
    }
    else {
        onclose.log("error getting data");
    }
}






const firebaseApp = initializeApp(getFirebaseConfig());
loadIdea();