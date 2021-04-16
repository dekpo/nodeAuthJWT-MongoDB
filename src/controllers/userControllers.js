const UserModel = require('../models/userModels');
const jwt = require('jsonwebtoken');
const config = require('../../config');

function createToken(user){
    return jwt.sign({ id: user.id, email: user.email}, config.jwtSecret, {
        expiresIn: 200 // valeur en secondes 60*60*24 pour 1 jour
    });
}

// controller d'enregistrement route /register
module.exports.registerUser = (req, res) =>{
    // si email et password ne sont pas présents
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({'msg': 'Email and password are mandatory !!!'});
    }
    UserModel.findOne({ email: req.body.email }, (err, user)=>{
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
        // on ne peut pas s'enregistrer 2x avec le meme email
        if (user){
            return res.status(400).json({'msg': 'This user already exists'});
        }
        // tout est bon pour créer le nouvel utilisateur
        const newUser = UserModel(req.body);
        newUser.save((err,user)=>{
            if (err) res.status(400).json({'msg':err});
            console.log('New User Registred :', req.body);
            res.json(user);
        });
    });
}

// controller de connexion route /login
module.exports.loginUser = (req, res) => {
    // si email et password ne sont pas présents
    if(!req.body.email || !req.body.password) {
        return res.status(400).json({'msg': 'Email and password are mandatory !!!'});
    }
    UserModel.findOne({ email: req.body.email }, (err, user)=>{
        if (err) {
            return res.status(400).json({ 'msg': err });
        }
        // on ne trouve pas l'utilisateur
        if (!user){
            return res.status(400).json({'msg': 'This user does NOT exists !'});
        }
        // on vérifie le password avec la methode compare
        user.comparePassword(req.body.password, (err, isMatch) => {
            // on a le bon password et pas d'erreur
            if (isMatch && !err){
                console.log('Utilisateur retrouvé connecté !!! ',req.body.email);
                return res.json({ token: createToken(user) });
            } else {
                return res.status(400).json({'msg': 'Wrong email or password...'});
            }
        });
    });
}