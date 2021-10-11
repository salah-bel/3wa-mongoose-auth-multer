const express = require('express')
const app = express()
const mongoose = require('mongoose')
const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
//utils for flash 
// flash 
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');

app.use(flash());
app.use(cookieParser())


const bcrypt = require('bcrypt')

const User = require('./models/user')

const port = 3000

//db
mongoose.connect('mongodb://localhost:27017/3wa', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:::', err));
// views
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }))

// mongoose storage
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/3wa',
    collection: 'mySessions'
});
// Catch errors
store.on('error', function(error) {
    console.log(error);
});

// session midelleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 1000 },
    store: store

}))

//isAuth middeleware
const isAuth = require('./middleware/isAuth')
    // home route
app.get('/', (req, res) => {

    console.log(req.session.id)
    res.render('index')
})

app.get('/dashboard', isAuth, (req, res) => {
    res.render('dashboard', { userId: req.session.userId })
})


// route login 
app.get('/login', (req, res) => {
    res.render('login', { message: req.flash('errorLogin') })

})
app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    // check si email  exist
    let user = await User.findOne({ email: email })
    if (!user) {
        req.flash('errorLogin', 'User or password dont exist')
        res.redirect('/login')
        console.log('user dont exist!');
    }

    // comparer le password hash 
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.redirect('/login')
    }

    // tout match 
    req.session.isAuth = true;
    req.session.userId = user._id;
    res.redirect('/dashboard')


})


//logout 
app.post('/logout', function(req, res) {
    req.session.destroy(function(err) {
        if (err) console.log(err)
        res.redirect('/')
    })
})











//post route
app.get('/register', (req, res) => {
    res.render('register')

})



// register 
app.post('/register', async(req, res) => {

    const { username, email, password } = req.body;
    // verifier si l'user exist 
    let user = await User.findOne({ email: email });
    console.log(" user 68", user)
    if (user) { return res.redirect('/register') }

    // hash password
    const hashedPasswoer = await bcrypt.hash(password, 10)

    try {

        const user = await new User({ username, email, password: hashedPasswoer })
        console.log("73", user)
        user.save(err => {
            if (err) console.log(err)
            res.redirect('/login')
        })
    } catch (error) {
        console.log(err)
    }

})



app.listen(port, () => console.log(`Example app listening on port port!`))