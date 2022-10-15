require('dotenv').config()
const fire = require("firebase");
fire.initializeApp({
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
})

 require("firebase/firestore");


const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})


const router = express.Router();

const app = express();
const PORT = 4000;

const oneDay = 1000 * 60 * 60 * 24;



app.set('view engine', 'ejs');


var users = [];

var db = fire.firestore();

function loaddbdata() {
    db.collection("users").get().then((snapshot) => {
        snapshot.forEach((doc) => {
        
           var myusername = doc.data().username;
           var mypassword = doc.data().password;
       
          var myprofileurl = doc.data().profileurl;
    
          var myteam = doc.data().team;
         
           var temp = {
            'username' : myusername,
            'password' : mypassword,
            'profileurl' : myprofileurl,
            'team' : myteam
           }
    
            users.push(temp);
        
        })
        
    })
}
loaddbdata();




/**
 * function to check wether 
 * the user entered data exist 
 * or not in db.
 */

 function authenticate(usern, userp) {
    for(var i=0 ; i<users.length; i++){
        if(users[i].username==usern && users[i].password==userp){
        
            return i;
        }
    }
    return -1;
}



app.use(sessions({
    secret: "secret_key",
    saveUninitialized: true,
    cookie:{maxAge: oneDay},
    resave:false
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname));

app.use(cookieParser());

app.use('/', router);
var session;








app.post("/signup", upload.single('logo_input'), (req, res) => {



   try {

    /**
     * adding user to
     * firestore
     */
    var userdata = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.pass,
        position : req.body.position,
        profileurl:"https://firebasestorage.googleapis.com/v0/b/local-dev-chat.appspot.com/o/common%2Fprofile.png?alt=media&token=170be037-d334-4d8d-97f3-205e7af049f4"
    }

    db.collection("users").doc(req.body.username).set(userdata).then(() => {
    
    });

    loaddbdata();

    res.render("Team-Builder-Login/sign-in/signin.ejs");

   }
   catch(e){
       console.log(e);
   }
  
})


app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.render('Team-Builder-Dashboard/index', {
            user : session.userid,
            profile_url: users[session.ind].profileurl
        });
    }else
    res.render('Team-Builder-Login/sign-in/signin',{root:__dirname});
});


app.post("/dashboard", (req, res) => {
   
        var requsername = req.body.username;
        var reqpassword = req.body.password;
         
        var index = authenticate(requsername,reqpassword);

          if(index!=-1 ){
              session = req.session;
              session.userid = req.body.username;
              session.ind = index;
              console.log(req.session);
            
            var user = session.userid;
              res.render("Team-Builder-Dashboard/index", {
                  user : user,
                  profile_url:users[index].profileurl
              });
          }
          else{
             console.log("invalid username or password "+index);
         }
})



app.post("/myteam", (req, res) => {
    var my_team = users[session.ind].team;
    var my_user = users[session.ind].username;
    res.render("Team-Builder-ChatUI/index", {
        team : my_team,
        user : my_user
    });
});


app.post("/idea", (req,res) => {
    console.log("ok till server");
    res.render("Team-Builder-Dashboard/idea-info-page/idea-info", {
        idea : req.body.idea
    });
});


app.post("/addIdea", (req, res) => {
    
    var my_user = users[session.ind].username;
    res.render("Team-Builder-ChatUI/index", {
        user : my_user
    });

});



app.post("/requests", (req, res) => {
    var my_user = users[session.ind].username;
    res.redirect("./views/Team-Builder-Dashboard/requests/request-page.html?user="+my_user);
    })


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
