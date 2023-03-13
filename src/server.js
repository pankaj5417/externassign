const express = require('express');
const session = require('express-session');
const passport = require('passport');
const nodemailer=require("nodemailer")

require("dotenv").config()
require("./config/db")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser');
const User = require('./models/User');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());


async function mailer(recievermail){

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS:true,
        auth: {
          user: process.env.NODEMAILER_EMAIL, // generated ethereal user
          pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: 'pk@gmail.com', // sender address
        to: recievermail, // list of receivers
        subject: "Notification", // Subject line
        text: `You are logged in successfully`, // plain text body
        html: `<b>You are logged in successfully</b>`, // html body
      });
    
       console.log("Message sent: %s", info.messageId);
       console.log("Preview URL:%s",nodemailer.getTestMessageUrl(info))
    

}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    // function (accessToken, refreshToken, profile, cb) {

    //   return cb(null, profile);
    // }

    async (accessToken, refreshToken, profile, done) => {
        //get the user data from google 
        const email= profile.emails[0].value
        const name=profile.displayName
        const newUser = {
          name: profile.displayName,
         
          email: profile.emails[0].value
        }

        try {
          //find the user in our database 
          let user = await User.findOne({ email:email })
          console.log("user",user)
          if (user) {
            await mailer(email)

            //If user present in our database.
            done(null, user)
          } else {
            // if user is not preset in our database save user data to database.
            user = await User.create(newUser)
            await mailer(email)
           console.log("newuser",user)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.get('/google-sign-in', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async  (req, res) =>{
    // const {name,email}=req.user._json
   console.log(req.user._json)
   

    res.cookie('user', req.user);
    res.redirect('/');
  }
);


app.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
