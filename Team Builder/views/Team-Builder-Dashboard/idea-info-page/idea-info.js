
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    onSnapshot,
  } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

  import { getFirebaseConfig } from '/views/firebase-config.js';


  /**
   * getting element 
   * handles
   */
  var description_Element = document.getElementById("description");
  var img_elemetn = document.getElementById("img");
  var title_element = document.getElementById("title");
  var admin_Element = document.getElementById("admin");
  var join_element = document.getElementById("join_btn");
  


 async function loadIdea() {
    const urlparm = new URLSearchParams(window.location.search);
    const doc_id = urlparm.get("docid");

    
 
    const docref = doc(getFirestore(), 'ideas', doc_id);
    // const docSnap = await getDoc(docref);

    try {
        const getdoc = onSnapshot(
            docref, (docu) => {
                 var data = docu.data();
              description_Element.textContent = data.description;
              img_elemetn.setAttribute("src",data.imgurl);
              title_element.textContent = data.title;
              admin_Element.textContent = data.admin;
              const urlparm = new URLSearchParams(window.location.search);
              const user = urlparm.get("user");
          
              if(user == data.admin) {
                  join_element.style.display="none";
              }

              join_element.addEventListener("click", function() {

               /**
                * adding request 
                * in firebase
                */
                 if(confirm(" do You really want to update send this request?")){
                    try {
                        await addDoc(collection(getFirestore(), 'requests'), {
                          sender: user,
                          receiver: admin,
                          'idea-id': h
                        });
                      }
                      catch(error) {
                        window.alert("no able to send request "+error);
                      }
                 }



                //  window.location.replace("http://localhost:4000/views/Team-Builder-Dashboard/requests/request-page.html");
              });

            })
    }
    catch(e) {
        console.log(e);
    }
   
 
}








const firebaseApp = initializeApp(getFirebaseConfig());
loadIdea();
//checkIdea();