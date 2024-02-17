require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const catchAsync = require('./utils/catchAsync');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2');
const FacebookStrategy = require('passport-facebook');
const User = require('./models/user');
const form = require('./controllers/contacto');
const expressSanitizer = require('express-sanitizer');

const MongoDBStore = require("connect-mongo");
const mongoSanitize = require('express-mongo-sanitize');

const userRoutes = require('./routes/users');
const homeRoutes = require('./routes/home');
const asignaturasRoutes = require('./routes/asignaturas');
const acercaRoutes = require('./routes/acerca');
const contactoRoutes = require('./routes/contacto');
const profilRoutes = require('./routes/profil');
const acuerdoRoutes = require('./routes/acuerdo');
const politicaRoutes = require('./routes/politica');
const terminoRoutes = require('./routes/condicion');


const { isLoggedOut } = require('./middleware');

// the database you’ll use also can be defined in an environmental variable
mongoose.Promise = global.Promise;
// This line tells Mongoose to connect to the database defined in MONGODB_URI 
// or to default to your local recipe_db database location.

//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/fivona_db", 
mongoose.connect(process.env.MONGODB_URI || "mongodb://0.0.0.0:27017/fivona_db",
{useNewUrlParser: true})

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(expressSanitizer());
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig = {
 
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

const config = {
    GoogleClientID: process.env.GOOGLE_CLIENT_ID,
    GoogleClientSECRET: process.env.GOOGLE_CLIENT_SECRET,
    GitHubClientID: process.env.GITHUB_CLIENT_ID,
    GitHubClientSECRET: process.env.GITHUB_CLIENT_SECRET,
    FacebookClientID: process.env.FACEBOOK_CLIENT_ID,
    FacebookClientSECRET: process.env.FACEBOOK_CLIENT_SECRET,
};

const google_auth = {
    callbackURL: 'https://www.fibonacciku.com/auth/google/callback',
    clientID: config.GoogleClientID,
    clientSecret: config.GoogleClientSECRET
}

const github_auth = {
    callbackURL: 'https://www.fibonacciku.com/auth/github/callback',
    clientID: config.GitHubClientID,
    clientSecret: config.GitHubClientSECRET
}

const facebook_auth = {
    callbackURL: 'https://www.fibonacciku.com/auth/facebook/callback',
    clientID: config.FacebookClientID,
    clientSecret: config.FacebookClientSECRET,
}

passport.serializeUser((User, done) => {
    done(null, User.id);
})
passport.deserializeUser((id, done) => {
    User.findById(id).then((User) => {
        done(null, User);
    })
})


   
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);

app.use('/home', homeRoutes);

app.use('/asignaturas', asignaturasRoutes);

app.use('/acerca', acercaRoutes);

// contact form
app.use('/contacto', contactoRoutes);

app.use('/fibo', profilRoutes);

app.use('/acuerdo', acuerdoRoutes);

app.use('/politica-privada', politicaRoutes);

app.use('/terminos-condiciones', terminoRoutes);

app.get('/', isLoggedOut, (req, res) => {
    res.render('index', {
        user: req.user
    })
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Página no encontrada :(', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No! Something went wrong!'
    res.status(statusCode).render('error', { err, user:req.user })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
});