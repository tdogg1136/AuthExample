const express = require("express");
const app = express();
const ejs = require("ejs");
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");





/////////////////////////////////////////
// Schema & Models 
/////////////////////////////////////////
const User = require("./models/user");



/////////////////////////////////////////////////////
//Connect to our Mongo Database
//////////////////////////////////////////////////////
mongoose.connect('mongodb://localhost:27017/auth_demo_app', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to Database!')
});



//////////////////////////////////////////////
//Set Templating Engine & Import Functions
//////////////////////////////////////////////
app.use(require("express-session")({
    secret: "William & Mary 1995",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//////////////////////////////////
//   Route Definitions 
//////////////////////////////////
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
});

//show sign up form
app.get("/register", (req, res) => {
    res.render("register");
});

//register new user
app.post("/register", (req, res) => {
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, (err, user) =>{

        if(err){
            console.log(err);
            return res.render('register');
        } else {
            passport.authenticate("local")(req, res,() =>{
                res.redirect("/secret");
            });
        }
     })
    });
   
//show login up form
app.get("/login", (req, res) => {
    res.render("login");
});

//login user logic using passport.authenticate middleware
app.post("/login", passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect : "/login",
   }), (req, res) => {

 });


 //Logout
app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});


//check to see if user is logged In before redirecting to page
function isLoggedIn(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }
    console.log("login failed");
    res.redirect("/login");
}


//////////////////////////////////////////////////////
//Start Server & Tell Express to listen for a request
//////////////////////////////////////////////////////
app.listen(3000, () => console.log("AuthDemo Server is Running!"));