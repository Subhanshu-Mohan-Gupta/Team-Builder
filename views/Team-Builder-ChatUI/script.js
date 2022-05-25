import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';
 import {
   getFirestore,
   collection,
   addDoc,
   query,
   orderBy,
   limit,
   onSnapshot,
   updateDoc,
   serverTimestamp,
   where,
 } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';
 import {
   getStorage,
   ref,
   uploadBytesResumable,
   getDownloadURL,
 } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js';


 import { getFirebaseConfig } from '/views/firebase-config.js';
 
//////  imports ended ///////






//initializing the elments
const messageFormElement = get(".msger-inputarea");
const messageInputElement = get(".msger-input");
const msgerChat = get(".msger-chat");
var messageListElement = document.getElementById('messages');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var memberListElement = get(".list");




messageFormElement.addEventListener("submit", event => {
  event.preventDefault();
 

  /**
   * this is the function that 
   * triggers when submit button is 
   * pressed
   * 
  */


  if(messageInputElement.value) {
    saveMessage(user,messageInputElement.value, user_team);
    messageInputElement.value = "";
   
  }
  else {
    window.alert("message can not be empty");
  }

});



async function saveMessage(my_user,messageText, team) {
  // Add a new message entry to the Firebase database.
  try {
    await addDoc(collection(getFirestore(), 'messages'), {
      name: my_user,
      text: messageText,
      profilePicUrl: "http",
      timestamp: serverTimestamp(),
      team : team
    });
  }
  catch(error) {
    window.alert("no able to save");
  }
}

function appendMessage(name, img, side, text) {

  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}





///function for querry selector
function get(selector, root = document) {
  return root.querySelector(selector);
}


function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}



function loadMessages() {    
  // Create the query to load the last 12 messages and listen for new ones.
  const recentMessagesQuery = query(collection(getFirestore(), 'messages'), where("team", "==", user_team), orderBy('timestamp', 'desc'), limit(12));

  // Start listening to the query.
  onSnapshot(recentMessagesQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteMessage(change.doc.id);
      } else {
        var message = change.doc.data();
        displayMessage(change.doc.id, message.timestamp, message.name,
                      message.text, message.profilePicUrl, message.imageUrl);
      }
    });
  });
}

 // Delete a Message from the UI.
 function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

 // Template for messages.
 var MESSAGE_TEMPLATE =
    '<div class="msg left-msg">' +
      '<div class="msg-img" style="background-image: url(https://as2.ftcdn.net/v2/jpg/02/15/84/43/1000_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg)"></div>'+
      '<div class="msg-bubble">'+
        '<div class="ccc">'+
          '<div class="msg-info-name left"></div>'+
          '<div class="msg-info-time right"></div>'+
        '</div>'+
        '<div class="msg-text">'+
        '</div>'+
      '</div>'+
    '</div>';

    var MESSAGE_TEMPLATE2 = 
    '<div class="msg right-msg">'+
    '<!-- <div'+
    'class="msg-img"'+
    'style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)" >'+
   '</div> -->'+
   '<div class="msg-bubble">'+
     '<div class="msg-info">'+
       '<div class="msg-info-name"></div>'+
       '<div class="msg-info-time"></div>'+
     '</div>'+
     '<div class="msg-text">'+
     '</div>'+
   '</div>'+
 '</div>';




  /**
   * two methods for loading 
   * and inserting messages
   */
  function createAndInsertMember(name){
  
    const container = document.createElement('li');
  
    memberListElement.appendChild(container)

    container.textContent=name;
  }

function loadMembers() {
  const recentMemberQuery = query(collection(getFirestore(), 'users'), where("team", "==", user_team));

  // Start listening to the query.
  onSnapshot(recentMemberQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        //deleteMessage(change.doc.id);
      } else {
        var member = change.doc.data();
        createAndInsertMember(member.username);
      }
    });
  });
}



 /**
  * two methods for loading
  * and inserting messages
  */

function createAndInsertMessage(user, name, id, timestamp) {
  const container = document.createElement('div');
 
  if(user === name){
    container.innerHTML = MESSAGE_TEMPLATE2;
  }
  else {
    container.innerHTML = MESSAGE_TEMPLATE;
  }
 
 
 
  const div = container.firstChild;
  div.setAttribute('id', id);

  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute('timestamp', timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[0];

    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

    messageListElement.insertBefore(div, messageListNode);
  }

  msgerChat.scrollTop += 600;

  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
  var div = document.getElementById(id) || createAndInsertMessage(user, name, id, timestamp);


  div.querySelector('.msg-info-name').textContent = name;
  var messageElement = div.querySelector('.msg-text');


  div.querySelector('.msg-info-time').textContent = formatTime(timestamp);

  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

function formatTime(timestamp) {
  
  return new Date(timestamp * 1000).toLocaleTimeString([], {hour: '2-digit',minute:'2-digit'});
  
}

function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  saveImageMessage(user, user_team, file);

}

var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

async function saveImageMessage(user, user_team, file) {
  try {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    const messageRef = await addDoc(collection(getFirestore(), 'messages'), {
      name: user,
      imageUrl: LOADING_IMAGE_URL,
      profilePicUrl: "http",
      timestamp: serverTimestamp(),
      team : user_team
    });

    // 2 - Upload the image to Cloud Storage.
    const filePath = `${user}/${messageRef.id}/${file.name}`;
    const newImageRef = ref(getStorage(), filePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    
    // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);

    // 4 - Update the chat message placeholder with the image’s URL.
    await updateDoc(messageRef,{
      imageUrl: publicImageUrl,
      storageUri: fileSnapshot.metadata.fullPath
    });

  } catch (error) {
    window.alert("image not uploaded : ");
    console.log(error);
  }
}


// Events for image upload.
imageButtonElement.addEventListener('click', function(e) {
  e.preventDefault();
  mediaCaptureElement.click();
});
mediaCaptureElement.addEventListener('change', onMediaFileSelected);


const firebaseApp = initializeApp(getFirebaseConfig());
const storage = getStorage(firebaseApp);

loadMessages();
loadMembers()