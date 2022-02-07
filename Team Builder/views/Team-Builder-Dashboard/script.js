/**
 * this are import for firebase 
 * firesore database.
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js';

 import {
  getFirestore,
  collection,
  // addDoc,
  query,
  // orderBy,
  limit,
  onSnapshot,
  // setDoc,
  // updateDoc,
  // doc,
  // serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js';

import {
  getStorage,
  // ref,
  // uploadBytesResumable,
  // getDownloadURL,
} from 'https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js';


import { getFirebaseConfig } from '/views/firebase-config.js';




//initializing elements
const closeMenu = document.querySelector(".close-dropdown");
const openMenu = document.querySelector("#menu-drop");
const menu = document.querySelector("nav");
var ideaListElement = document.getElementById("idea-list");
var profileListElement = document.getElementById("profile_list");
var teamListElement = document.getElementById("team_list")
var myTeamButtonElement = document.getElementById("myteam");

  var idea_form_element = document.getElementById("ideaform");

function toggleMenu() {
  menu.classList.toggle("active");
}

function openDrop() {
  toggleMenu();
}

function closeDrop() {
  toggleMenu();
  openMenu.checked = false;
}

openMenu.addEventListener("click", openDrop);
closeMenu.addEventListener("click", closeDrop);

myTeamButtonElement.addEventListener("click", myTeam);
var myFormElement = document.getElementById('teamform');



/**
 * as we have not added
 * time stamp in the ideas 
 * it is removed for now
 */
//orderBy('timestamp', 'desc'),

function loadIdea() {
  // Create the query to load the last 12 messages and listen for new ones.
  const recentMessagesQuery = query(collection(getFirestore(), 'ideas'), limit(12));
  
  // Start listening to the query.
  onSnapshot(recentMessagesQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteIdea(change.doc.id);
      } else {
        var idea = change.doc.data();
        displayIdea(change.doc.id, idea.title,
                      idea.description, idea.imgurl);
      }
    });
  });
}

function createAndInsertIdea(id) {
  const container = document.createElement('div');
  container.innerHTML = IDEA_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

    ideaListElement.appendChild(div);

  // msgerChat.scrollTop += 600;

  return div;
}


//// templates for elements
// Template for Idea.
var IDEA_TEMPLATE =
          '<div class="idea" onclick="myIdea(this.getAttribute(`id`));">'+
            '<div class="img">'+
              '<img id="idea-image" alt="Thumbnail idea" />'+
            '</div>'+
            '<div class="info-idea">'+
              '<h2 id="idea-name"></h2>'+
              '<span id="idea-description"></span>'+
            '</div>'+
          '</div>';

var PROFILE_TEMPLATE = 
           '<div class="view v1">'+
             '<div class="img" id="profile_pic"></div>'+
           '<div class="info">'+
             '<p id="profile_name"></p>'+
          '<span id="last login">1 day ago</span>'+
             '</div>'+
            '<span id="position"></span>'+
            '</div>';

var TEAMS_TEMPLATE = 
        '<div class="team t1">'+
        '<div class="img" id="team_logo"></div>'+
        '<p id="team_name"></p>'+
        '<span id="project_idea">Project Idea/Description</span>'+
         '</div>';




// Displays a Idea in the UI.
function displayIdea(id, idea_name, idea_description, idea_url) {
  var div = document.getElementById(id) || createAndInsertIdea(id);

  var idea_name_Element = div.querySelector('#idea-name');
  var idea_description_Element = div.querySelector('#idea-description');
  var idea_image_element = div.querySelector('#idea-image');

  idea_name_Element.textContent = idea_name;
  idea_description_Element.textContent = idea_description;
  idea_image_element.src = idea_url;

}

function deleteIdea(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}




function loadProfiles() {
  // Create the query to load the last 12 messages and listen for new ones.
  const recentMessagesQuery = query(collection(getFirestore(), 'users'), limit(12));
  
  // Start listening to the query.
  onSnapshot(recentMessagesQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteProfile(change.doc.id);
      } else {
        var profile = change.doc.data();
        displayProfile(change.doc.id, profile.username,
                      profile.profileurl, profile.position);
      }
    });
  });
}

function displayProfile(id, profile_username, profile_url, profile_position) {
  var div = document.getElementById(id) || createAndInsertProfile(id);

  var profile_user_Element = div.querySelector('#profile_name');
  var profile_pic_Element = div.querySelector('#profile_pic');
  var profile_position_Element = div.querySelector('#position');

  profile_user_Element.textContent = profile_username;
  profile_position_Element.textContent = profile_position;
  profile_pic_Element.style.backgroundImage = "url('"+profile_url+"')";


}

function createAndInsertProfile(id) {
  const container = document.createElement('div');
  container.innerHTML = PROFILE_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

    profileListElement.appendChild(div);


  return div;
}
function deleteProfile(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}


//loading Teams
function loadTeams() {
  // Create the query to load the last 12 messages and listen for new ones.
  const recentMessagesQuery = query(collection(getFirestore(), 'teams'), limit(12));
  
  // Start listening to the query.
  onSnapshot(recentMessagesQuery, function(snapshot) {
    snapshot.docChanges().forEach(function(change) {
      if (change.type === 'removed') {
        deleteTeam(change.doc.id);
      } else {
        var team = change.doc.data();
        displayTeam(change.doc.id, team.team_name,
                      team.project_idea, team.team_logo_url);
      }
    });
  });
}

function displayTeam(id, team_name, project_idea, team_logo_url) {
  var div = document.getElementById(id) || createAndInsertTeam(id);

  var team_name_Element = div.querySelector('#team_name');
  var team_logo_Element  = div.querySelector('#team_logo');
  var project_idea_Element = div.querySelector('#project_idea');

  team_name_Element.textContent = team_name;
  project_idea_Element.textContent = project_idea;
  team_logo_Element.style.backgroundImage = "url('"+team_logo_url+"')";

}

function createAndInsertTeam(id) {
  const container = document.createElement('div');
  container.innerHTML = TEAMS_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

    teamListElement.appendChild(div);

  return div;
}



function deleteTeam(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}



function myTeam() {
//window.alert("success till here");
 myFormElement.submit();
}

function myIdea(e) {

window.alert("class : "+e);
 
  // if(e.target != this){
  //   var ev = new CustomEvent('click');
  //    this.dispatchEvent(ev);
  //    e.preventDefault();
  //    e.preventPropagation();
  //    window.alert("ok till function "+e.target.id);
 
  // }
  // else {
  //   window.alert("ok till function "+e.target.id);
 
  // }

     
  
  //idea_form_element.submit();
}

const firebaseApp = initializeApp(getFirebaseConfig());
const storage = getStorage(firebaseApp);

loadIdea();
loadProfiles();
loadTeams();
// var idea_ligend_Eliment_list = document.querySelectorAll(".idea");
// idea_ligend_Eliment_list.forEach(elemt => {
  
//   elemt.addEventListener("click", myIdea);
// })