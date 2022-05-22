
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';

import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
  } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';


 import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js';


import { getFirebaseConfig } from '/views/firebase-config.js';


/**
 * Initializing Elements
 */
var form_element = document.getElementById("form_Element");
var idea_title_element = document.getElementById("idea-title");
var idea_description_element = document.getElementById("description");
var idea_logo_Element = document.getElementById("logo-input");



form_element.addEventListener("submit", event => {
   event.preventDefault();
 
    var logo_image = idea_logo_Element.files[0];

   if(idea_title_element.value && idea_description_element.value) {
    
       
      
     addIdea(idea_title_element.value, idea_description_element.value, logo_image);
  
     idea_title_element.value='';
     idea_description_element.value ='';
     idea_logo_Element.value=null;
  
    }
   else {
       window.alert("idea Title and idea Description can not be empty");
   }

    

});


async function addIdea(title, description, logo_image) {
    
    const urlparm = new URLSearchParams(window.location.search);
    const user = urlparm.get("user");



    
    try{
        const idearef = await addDoc(collection(getFirestore(), 'ideas'), {
           admin : user,
           description : description,
           imgurl : "http",
           title : title
          });


          const filePath = `ideas/${idearef.id}/${logo_image.name}`;
          const newideaRef = ref(getStorage(), filePath);
          const fileSnapshot = await uploadBytesResumable(newideaRef, logo_image);
          
          // 3 - Generate a public URL for the file.
          const publiclogoUrl = await getDownloadURL(newideaRef);


          await updateDoc(idearef,{
            imgurl: publiclogoUrl,
            //storageUri: fileSnapshot.metadata.fullPath
          });

          


     }
     catch(e) {
         console.log("unable to upload idea : "+e);
     }
}

const firebaseApp = initializeApp(getFirebaseConfig());
const storage = getStorage(firebaseApp);


