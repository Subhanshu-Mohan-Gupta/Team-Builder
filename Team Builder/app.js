const fire = require("firebase");
fire.initializeApp({
    apiKey: "AIzaSyAh6TNZwIs92kWMOCdRHHJdxfcRCl8zue0",
    authDomain: "local-dev-chat.firebaseapp.com",
    projectId: "local-dev-chat",
    storageBucket: "local-dev-chat.appspot.com",
    messagingSenderId: "102203063472",
    appId: "1:102203063472:web:6f2b1467e172988636cf75",
    measurementId: "G-GJTLTZEDVL"
})

 require("firebase/firestore");


const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');


const app = express();
const PORT = 4000;

const oneDay = 1000 * 60 * 60 * 24;



app.set('view engine', 'ejs');


var users = [];

var db = fire.firestore();

db.collection("users").get().then((snapshot) => {
    snapshot.forEach((doc) => {
    
       var myusername = doc.data().username;
       var mypassword = doc.data().password;
   
      var myprofileurl= doc.data().profileurl;

     
       var temp = {
        'username' : myusername,
        'password' : mypassword,
        'profileurl' : myprofileurl
       }

        users.push(temp);
    
    })
    
})

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

var session;






app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.render('Team-Builder-Dashboard/index', {root:__dirname});
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
              console.log(req.session);
            //   res.render("test");
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


app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));
 module.exports = app;