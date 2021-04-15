const express = require('express');
const PORT = 3000;
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config');
const app = express();
// config express
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// on utilise le package passport
app.use(passport.initialize());
const passportMiddleware = require('./src/middleware/passport');
passport.use(passportMiddleware);
// la route classique et les routes spécifiques
app.get('/', (req,res)=>{
    res.send('The server is running on port '+PORT);
});
const routes = require('./src/routes/userRoutes');
app.use('/', routes);
app.listen(PORT);
// on se connecte au serveur MongoDB
mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
    console.log('MongoDB connected successfully !!!');
});