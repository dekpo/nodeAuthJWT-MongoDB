const express = require('express');
const routes = express.Router();
const controllers = require('../controllers/userControllers');
const passport = require('passport');

routes.post('/register', controllers.registerUser);
routes.post('/login', controllers.loginUser);

routes.get('/admin', passport.authenticate('jwt', { session: false}), (req,res)=>{
    return res.json({'msg': 'Hello ! '+req.user.email+' Welcome to your admin panel !!!'});
});

module.exports = routes;