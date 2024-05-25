const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

mongoose.set('strictQuery', false);

const uri = "mongodb://root:<replace password>@localhost:27017";
mongoose.connect(uri, { 'dbName': 'SocialDB' });

const User = mongoose.model('User', { username: String, email: String, password: String });
const Post = mongoose.model('Post', { userId: mongoose.Schema.Types.ObjectId, text: String });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: SECRET_KEY, resave: false, saveUninitialized: true, cookie: { secure: false } }));


// Insert your authenticateJWT Function code here.
function authenticateJWT(req, res, next) {
    const token = req.session.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    };
};

// Insert your requireAuth Function code here.
function requireAuth(req, res, next) {
    const token = req.session.token;
    if (!token) return res.redirect('/login');
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/login');
    };
};
// Insert your routing HTML code here.
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.get('/register', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
);

app.get('/login', (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
);

app.get('/post', requireAuth, (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'post.html'))
);

app.get('/index', requireAuth, (req, res) =>
    res.sendFile(path.join(__dirname, 'public', 'index.html'), { username: req.user.username })
);

// Insert your user registration code here.

// Insert your user login code here.

// Insert your post creation code here.

// Insert your post updation code here.

// Insert your post deletion code here.

// Insert your user logout code here.

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
